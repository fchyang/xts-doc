---
sidebar_position: 1
---
# CTS

## CTS环境配置注意事项

### CTS media文件下载

* 手动下载地址：[CTS media](https://source.android.com/docs/compatibility/cts/run-locally)
* source.android.com的版本可能不够新，如果没有DUT对应Android版本的media文件，可以在跑测时加入-lInfo，log中会包含下载链接（一般是dl.google.com/xxxx），然后可以在浏览器输入链接进行下载，tool本身虽然会下载但是很慢。

## CTS常见fail项及解决方案

### CtsCameraTestCases

#### 常见问题：未接camera硬件导致测试fail

解决方案：

外接camera硬件，推荐使用以下型号的camera：

* logitech C920
* logitech C670i FHD Webcam
* Lenovo 50 Monitor Camera

另外，已知以下型号camera测an16可能会fail：

* nnex C470 (4K AI ePTZ Webcam)
* Logitech C310 (HD Webcam)

### CtsHdmiCecHostTestCases

#### 常见问题：缺少硬件或者连接问题

解决方案：

* 缺少hdmi-cec adaptor的，需自行采购
* 将hdmi线连接到板子的arc/earc口，连接后，在TV的UI上，input source中可以看到CECTester
![cec-adapter](/img/hdmi-cec.png)

  * 如果不显示的话，请检查server上hdmi口是否有接其他设备，有的话可以拔掉别的hdmi设备，让server只连接hdmi-cec adaptor
    * 基于新版cts tool，cec-adaptor的PA默认是0x1000，如果server上hdmi口接有其他设备(如显示器)，会导致cec-adaptor的PA是0x2000 or 0x3000，跑测试过程中不能正常切到0x1000，从而引起测试fail。
	* check cec hal和passthrough apk是否有degrade修改
* 每次retry时，先删除/tmp/cec-test-temp/目录

#### 常见问题：测项android.hdmicec.cts.tv.HdmiCecRemoteControlPassThroughTest#cect_11_1_13_5_RemoteControlPassthroughWithMultipleDevices

解决方案：

* 对于low memory device( `memory <= 1.5G` )，进入bootcode，输入以下指令：
  
  ```
  env set bootargs_ex no_kill_list=3@providers.tv,realtek.tv,adbd
  env save
  ```
  
  将providers.tv和realtek.tv加入no killer list

### CtsDeqpTestCases

#### 常见问题：module子测项过多导致incomplete

解决方案：放到最后retry，先使用参数：--exclude-filter CtsDeqpTestCases，等其他module差不多都pass了，再去掉参数，进行完整retry

### CtsSecurityTestCases

#### 常见问题：dias monitor设备跑测android.security.sts.CVE_2021_0392#testPocCVE_2021_0392时卡住

解决方案： 测试过程中，tool会检测不到device，此时通过在shell中手动设置：

```Shell
settings put global adb_enabled 0
settings put global adb_enabled 1
```

### CtsIntentSignatureTestCases

#### 常见问题：android.signature.cts.intent.IntentTest#shouldNotFindUnexpectedIntents

解决方案： 自定义的action不能以android开头，可以改成以包名开头的action，这个case比较容易出问题，apk owner要多留意

### CtsStatsdAtomHostTestCases

#### 常见问题：android.cts.statsdatom.statsd.UidAtomTests#testLmkKillOccurred

解决方案： 测试过程是确认lmk_victim这个test process有没有被lmkd杀掉，但跑测过程容易发生oom，lmkd在杀lmk_victim之前先发生了oom，这样就会有问题， 所以要在oom之前先触发lmkd：

* 调整low memory killer水位： swap_free_low_percentage = 1，之前值为0，lmkd触发的太晚，现在swap free剩余1%的时候就可以触发lmkd
* bootcode模式下输入命令：
  
  ```
  env set bootargs_ex androidboot.zram.size=300m
  env save
  ```
  
  手动bootcode设定zram大小来调整swap，debug用。
* https://source.android.com/docs/core/perf/lmkd?hl=en lmkd参数参考

### CtsWifiTestCases

#### 常见问题：android.net.wifi.cts.WifiManagerTest#testNetworkStackPermission

解决方案：可以从test的result里的PackageDeviceInfo.deviceinfo.json文件中找到是哪个process直接持有android.permission.NETWORK_STACK，这个permission一般是禁止申明使用的。

#### 常见问题：android.net.wifi.cts.WifiNetworkSuggestionTest#testConnectToSuggestionThenRemoveWithLingering

解决方案：路由器2.4G/5G多频合一的设定，会导致这个测项在2.4G和5G wifi之间来回切换，引起时序问题，测试fail，可以只连2.4G或5G网段wifi

### CtsWindowManagerDeviceTestCases

#### 常见问题：android.server.wm.KeepScreenOnTests#testKeepScreenOn_activityOnDefaultDisplay_screenStaysOn

解决方案：测试flow里TurnScreenOnActivity会去设定保持屏幕亮的动作，实际上fulltest这项有机会立刻关屏，导致测试fail，通过factory reset以后复测可以pass

