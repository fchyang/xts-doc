---
sidebar_position: 7
---

# env-set

XTS环境分成Server端（即Host端）和DUT端（即Client端）两部分。

## Server端环境配置

* 操作系统版本：Ubuntu 24.04+
* Python版本：3.12+
* Java版本：openJDK 11+
* Android Platform Tools: 下载最新版，[下载链接](https://developer.android.com/tools/releases/platform-tools)
* Android Build Tools: 下载最新版，[下载链接](https://androidsdkmanager.azurewebsites.net/build_tools.html)

通过以下命令，维持ADB连接：

```Shell
watch -n 1 adb connect {ip}
```

将`{ip}`替换为DUT的`ip`地址。

### TVTS额外配置

参考以下文档进行配置： [TVTS设置](https://docs.partner.android.com/tv/test/tvts/run?authuser=3) Unbuntu在较新的版本中，出于安全考虑，不再允许用户直接安装python库，推荐安装pyenv进行python环境管理，Unbuntu的安装命令如下：

```Shell
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
```

对于TvtsMemoryScoreTestCases和TvtsMemoryScoreTestCasesV2这两个测项，需要安装perfetto和protobuf两个python库，安装命令如下：

```Shell
python -m pip install perfetto
python -m pip install protobuf
```

其中，perfetto库需要CPU支持AVX2、BMI2等指令，可以通过`cat /proc/cpuinfo`命令查看。

对于TvtsEnduranceTestCases一项，需要安装webfs和webfsd，命令如下：

```Shell
sudo apt install webfs  webfsd
sudo mkdir -m 777 -p /var/www/html
```

### CTS额外配置

对于CtsHdmiCecHostTestCases，参考以下两个文档： [cec\_adapter.md](https://android.googlesource.com/platform/cts/+/refs/heads/master/hostsidetests/hdmicec/cec_adapter.md) [README.md](https://android.googlesource.com/platform/cts/+/refs/heads/master/hostsidetests/hdmicec/README.md)

安装cec-utils:

```Shell
apt install cec-utils
```

另外需要一个硬件：​**cec-adaptor**​，购买链接：[Amazon](https://www.amazon.com/-/zh/dp/B005JU6LWM/ref=sr_1_1?crid=UK4LY390M5H2&dib=eyJ2IjoiMSJ9.pqSuARZq3-vcDQ6jrVlOvRbzOpX8gM3xzliyal7my5w.RzJNDbo7LI5gKR0qH5DbtiZcBsg4UdNevN3CJKA68GM&dib_tag=se&keywords=pulse+eight+usb+cec+adapter&qid=1768553619&sprefix=usb+cec+adapter+pulse+%2Caps%2C218&sr=8-1)

### USE\_ATS

从AN14 CTS R6/GTS 12R1开始，Google在CTS和GTS tool里加了USE\_ATS的flow，目前暂时将USE\_ATS设置为false跑测，存在以下问题：

* 第一次跑测会从Google download MCTS包，后续跑测很多module不是跑tool里自带的modules，而是用下载下来的MCTS packages。
* 下载MCTS需要很久，M即Mainline，顾名思义，这个MCTS主要是测mainline modules，但是我们目前GTV主要用了2\~3个mainline module。
* 当前MCTS还主要是for Mobline，对TV不是enforcement。
* 新版tool还不太稳定，经常会跑出result total modules只有200 or 600多，不是常见的800多modules
* 启用USE\_ATS以后，XTS会运行在一个OLC Server上，同一台server同一时间只能跑一个测试进程
* 我们在server加入export USE\_ATS=false或ENABLE\_XTS\_DYNAMIC\_DOWNLOADER=false，skip现有的flow，跑tool原有的modules
* 已经向Google提交ticket: [IssueTracker](https://partnerissuetracker.corp.google.com/u/1/issues/406436513)，按照Google的回复，后续有可能检查是否启用USE\_ATS

## DUT配置

### bootcode设定

* 重启，并在串口按住ESC，DUT进入bootcode模式
* 串口输入：env set androidboot cts
* 串口输入：env save
* 串口输入：re

### 刷GSI Image

**注意：** 跑测CTS-on-GSI时，需要刷GSI Image，跑测VTS时需要刷GSI Image和vendor\_boot\_debug

刷GSI Image步骤：

1. 重启DUT并在串口按住ESC键，进入bootcode模式
2. 在串口输入：env set OEMLock off
3. 在串口输入：env save
4. 在串口输入：usb\_gadget disable
5. 在串口输入：re
6. server端输入fastboot -s `tcp:{ip}` flash system system.img
7. server端输入fastboot -s `tcp:{ip}` -w --fs-options=casefold

将上面的`{ip}`替换为DUT的实际`ip`地址，system.img在[GSI Image](https://docs.partner.android.com/tv/test/android/gsi?authuser=3)下载。 刷vendor\_boot\_debug.img步骤：

1. 重复刷GSI Image的步骤1-5
2. server端输入fastboot -s `tcp:{ip}` flash vendor\_boot vendor\_boot\_debug.img

### TV设定

在UI上进行如下设定：

* settings -> system -> language -> United States
* settings -> System -> Power & Energy -> ShutOff Timer ->When inactiver -> Never
* settings -> System -> Power & Energy -> ShutOff Timer ->When watching -> Never
* settings -> System -> No signal sleep timer -> Never
* settings -> System -> About -> Android TV OS build，连续按6次进入开发者模式，即Developer options
* settings -> System -> Developer options -> Usb debugging enable (for adb)
* settings -> System ->Developer options -> Stay awake -> enable
* Google play store-> Play Protect->Scan apps with play Protect，关闭安装测试apk时的弹窗提示，否则可能挡掉一些测项的UI检测。
* Google play store -> Settings -> Auto-update apps，将自动更新关闭，手动更新所有的APP

其中，打开开发者模式并允许USB调试的步骤，除了UI以外，也可以通过在串口中输入如下Shell命令设置：

```Shell
settings put global development_settings_enabled 1
settings put global adb_enabled 1
```

特别地，如果手中没有蓝牙遥控器，无法通过正常的流程进入Android TV的主页，需要跳过setup wizard的界面，可以在shell中输入以下命令：

```Shell
settings put global google_remote_pairer 0
reboot
```

### Monitor设定

Monitor也需要进行TV设定中的所有设定，并且在UI上额外执行以下设定：

* Settings > system > Monitor > Auto Switch Settings > off
* Settings > Network & Internet > Wifi Configs > Network Standby > on(R+3.0)

除了UI设定以外，Monitor还需要进行以下shell命令设定：

```Shell
settings put global auto_switch_behavior 2
settings put global shortcut_menu_hint 1
```

## 其它配置

* logcat buffer size设定：对于部分测项，会读取logcat抓取关键词，可以通过logcat -G 2M这样的命令来调整buffer size，防止log被冲掉
* RPK注册，参考[RKP注册](https://wiki.realtek.com/display/MDKB/%5BAndroid-14%5D+Android+RKP+registration)，通过shell命令：rtk\_system\_info --check，可以检查各种key的烧录情况，确保key的烧录完整
  
  ```
  ![](https://wiki.realtek.com/download/thumbnails/1038248391/image-2025-7-7_11-31-46.png?version=1&modificationDate=1768986624290&api=v2)
  ```

## 网络环境配置

* 路由器的WiFi，把2.4G跟5G频段分开，不要使用混合模式，需要连接WiFi的测项，仅连接2.4G or 5G频段，推荐2.4G
* Android 14+，DUT和server都要能访问google，所以需要能访问外网的网络
* Android 13以下的XTS tool，server端不需要访问Google，但是DUT仍然需要

特别地，对于WiFi相关的测项，DUT需要连接WiFi，但是Android TV在连接有线网时，无法连接WiFi，而如果server跟DUT通过WiFi的ip地址进行ADB连接，容易出现ADB断连导致fail，解决方案有2个：

1. 如果DUT支持USB ADB连接，DUT不连接有线网，只连接WiFi，server端通过USB线和DUT进行ADB连接
2. DUT不支持USB ADB，在路由器中进行设置，关闭DUT的有线网的互联网访问权限，拔掉DUT的有线网，连接WiFi以后，再给DUT插上有线网，这样可以实现DUT的两个IP地址同时存在，server端则通过DUT的有线网IP地址进行ADB连接

# XTS通用知识

## 通用命令

|命令         |作用                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------- |
| l r        | 查看结果                                                                                    |
| l i        | 查看目前跑测中的invocations                                                                 |
| l d        | 查看连接中的DUT信息，只有available的DUT才能开始跑测                                         |
| `i {n}` stop | 发出将`{n}`号invocation停止的请求，会等待当前测试进程停止，测试卡死但是想出报告的时候可以使用 |