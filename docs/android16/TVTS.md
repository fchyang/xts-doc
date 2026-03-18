---
sidebar_position: 5
---

# TVTS

## TVTS环境配置

[参考文档](https://docs.partner.android.com/tv/test/tvts?hl=en)

* DUT的性能会影响测试结果，包括：Memory、CPU loading、APP cold/warm/hot start、APP switch、...
* 网络：带宽越大越好，要download也要在线播放；并且以美专网络为宜
* google account：以google partner account为宜，苏州用的邮箱账号
* google server：测试会连接google server，比如：katniss、keymint、gms等
* google apk自身问题：比如gms、katniss、Launcherx等，某些版本可能有BUG，可以尝试不同版本
* 平台自身问题：hw平台差别、lmkd参数调整，memory配置，zram大小，内核参数设定等，需要优化

## 常见问题

### TvtsAssistant4TestCases

#### 常见问题：测试容易fail

解决方案：

* 跑测之前可以先确认下katniss是否能正常启动，返回正确的搜索结果，建议先切换到partner account测试。
* 对于low memory device( `memory <= 1.5G` )，DUT进入bootcode模式，输入以下命令：
  
  ```Shell
  env set bootargs_ex no_kill_list=4@testexoplayer,search,katniss,adbd
  env save
  ```
  
  然后进入normal模式，输入以下命令：
  
  ```Shell
  pm disable-user --user 0 com.cltv.hybrid;
  pm disable-user --user 0  com.android.vending;
  pm disable-user --user 0 com.google.android.youtube.tvmusic;
  pm disable-user --user 0  com.cltv.mal;
  pm disable-user --user 0  com.android.bluetooth;
  pm disable-user --user 0  com.netflix.ninja;
  pm disable-user --user 0  com.google.android.youtube.tv;
  pm uninstall com.iqiyi.i18n.tv;
  pm uninstall com.apple.atve.androidtv.appletv;
  pm uninstall com.disney.disneyplus;
  pm uninstall com.amazon.amazonvideo.livingroom;
  pm uninstall com.wbd.stream;
  ```
  
  重启DUT以后，复测。

#### 常见问题：testCategoryQuery

解决方案；

* shell输入：
  
  ```Shell
  - am start -a android.intent.action.ASSIST --ei search_type 1 --es query "Search for action movies"
  - dumpsys activity activities | grep ResumedActivity
  ```
  
  正常输出是launcherx，如果是其它activity，那么可以尝试切换账号/网络，或者可能是katniss apk版本问题，可以尝试卸载katniss的更新或者更新katniss到最新版。
  
  ![](/img/katniss-1.png)

#### 常见问题：testEntityQuery

解决方案：

* shell输入以下命令，调整logcat buffer size：
  
  ```Shell
  logcat -G 1M
  ```
* shell输入：
  
  ```Shell
  - am start -a android.intent.action.ASSIST --ei search_type 1 --es query "Search for Fight Club"
  - dumpsys activity activities | grep ResumedActivity
  ```
  
  输出结果应该是launcherx，如果不是，那么可以尝试切换账号/网络，或者可能是katniss apk版本问题，可以尝试卸载katniss的更新或者更新katniss到最新版。
  
  ![](/img/katniss-2.png)

### TvtsEnergyModesTestCases

#### 常见问题：com.google.android.energymodes.tvts.EnergymodesTest#testEnergyModesAPK

解决方案：

* 确认DUT是否支持FFM，在shell中输入以下命令：
  ```Shell
  - pm list feature -f | grep HOT
  - dumpsys power | grep HOT
  ```
  
  如果有SOFTWARE\_HOTWORD这个feature，就是支持FFM，否则就是不支持。
* 对于R2U的DUT，可以通过修改/oem/etc/permission/echo\_reference.xml，来控制FFM的有无
* 对于Android U的DUT，通过ro.vendor.ffm.enable这个属性来控制
* 如果不支持FFM的DUT，属性设置为支持，就会导致fail

### TvtsYouTubeTS

#### 常见问题：测试容易跑不完整，且子测项中没有testYTS就无法继续测试

解决方案： 跑测时，先使用参数：--exclude-filter TvtsYouTubeTS，将这个module排除，在完成其它测项以后再去掉这个参数来进行测试。

  ![](/img/yts-1.png)

#### 常见问题：1.5x的测试项容易fail

解决方案： 在server端开两个独立的shell，分别输入以下命令：

```Shell
watch -n 1 adb -s {dut ip} shell device_config put media_native render_metrics_enable false
```

```Shell
watch -n 1 adb -s {dut ip} shell device_config put media_native render_metrics_enabled false
```

### TvtsPerfCujTestCases

#### 常见问题：测试容易出现fail

解决方案：

* 如果屏保能正常打开的话，一般不会有什么问题
* GTV/ATV，一般遥控按返回按键，屏保会出来，如果出不来，可能需要如下shell命令打开屏保：
  ```Shell
  settings put secure screensaver_enabled 1
  ```
  
  或者在UI上设置：Settings > Apps > See all apps > Ambient Mode > Enable
* 可以尝试factory reset以后，确保屏保能正常运行，再复测

### TvtsMemoryScoreTestCasesV2

#### 常见问题；测试容易fail

解决方案：

* 参考TvtsAssistant4TestCases的解决方案，确认katniss搜索结果的正确性
* 如果搜索结果正常，检查网络环境，确保跟Google服务器的连接延迟不会太高
* 确保RKP有正确注册，这个会影响testexoplayer一项
* 对于low memory device( `memory <= 1.5G` )，将testexoplayer加入no kill list

### TvtsMemoryScoreTestCases

#### 常见问题：测试容易fail

解决方案：

* shell输入以下命令：
  ```Shell
  rtk_system_info --check
  ```
  
  确保key都有烧录
* 在Google play store中，手动更新所有的apk，然后关闭自动更新
* 参考TvtsAssistant4TestCases的解决方案，确认katniss搜索结果的正确性
