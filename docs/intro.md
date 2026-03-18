---
sidebar_position: 1
---

# AndroidTV XTS

## 名词定义

本文档及子文档中，将涉及以下专有名词：

|                 |                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| XTS             | 包含CTS, CTS-on-GSI, STS, VTS, GTS, TVTS，是用于Google Android认证的一系列测试工具的总称                                                  |
| CTS             | Compatibility Test Suite，测试设备对Android的兼容性                                                                                       |
| CTS-on-GSI      | 将system分区替换为GSI以后运行的CTS，使用跟CTS同样的测试套件                                                                               |
| GSI             | General System Image，Google提供的通用系统映像                                                                                            |
| STS             | Security Test Suite，测试设备的安全特性，包括权限管理、数据加密、网络安全等方面                                                           |
| VTS             | Vendor Test Suite，测试 Android 设备的核心硬件抽象层 HAL、库 Libraries 和底层软件系统（比如 Kernel、Fireware 等）的健壮性、兼容性和依赖性 |
| GTS             | GMS Test Suite，测试GMS能否正常工作的测试工具                                                                                             |
| GMS             | 谷歌移动服务组件                                                                                                                          |
| TVTS            | TV Test Suite，测试Android TV的功能和性能，包括TV APK如Netflix, Youtube等能否正常工作，以及Video/Audio Encoder/Decoder性能，Memory性能等  |
| DUT             | Device Under Test，被测试的设备，本文中一般指一台Android TV设备                                                                           |
| userdebug image | userdebug版本的image，可以root，可以用su权限进行操作                                                                                      |
| user image      | user版本的image，无法root，不可以用su权限进行操作                                                                                         |
| Monitor设备     | 有别于TV的另一个设备种类，跟TV的环境有一些差异，也需要通过XTS认证                                                                         |
| bootcode        | Android TV中，有别于普通模式的另一个模式，可以在里面调整一些更加底层的配置，主要用于开发调试                                              |
| 串口            | Android TV硬件上开放出来的调试接口，通过串口连接到host端主机，允许host端直接通过串口输入shell命令                                         |
| ADB             | Android Debug Bridge，允许host端主机连接到DUT，执行shell命令进行调试，XTS执行测试需要确保host端跟DUT的ADB是连接上的                       |
| APP/APK         | Application，指运行在Android平台上的应用或者其安装文件（格式为\*.apk）                                                                    |

对于Android版本，有两种表示方法：数字或者字母，不同的表示方法指向同一版本，本文档中提到的版本代号说明如下：

|            |           |
| ------------ | ----------- |
| Android 10 | Android P |
| Android 11 | Android R |
| Android 12 | Android S |
| Android 13 | Android T |
| Android 14 | Android U |
| Android 15 | Android V |
| Android 16 | Android B |

另外，文档中可能用"AN"作为"Android"的缩写。

## 下载链接

Google认证使用的是release版本的tool，下载链接如下：

|                      |                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| CTS                  | https://source.android.com/docs/compatibility/cts/downloads                              |
| CTS-Android 11版     | https://ci.android.com/builds/branches/aosp-android11-tests-release/grid?legacy=1        |
| TVTS                 | https://docs.partner.android.com/tv/test/tvts/release-notes?authuser=1&hl=zh-tw          |
| GTS                  | https://docs.partner.android.com/gms/testing/gts?authuser=1&hl=en                        |
| VTS                  | https://docs.partner.android.com/gms/testing/vts?authuser=1&hl=en                        |
| GSI Image            | https://docs.partner.android.com/tv/test/android/gsi?authuser=3                          |
| STS                  | https://docs.partner.android.com/security/test-suite/latest-sts-binary                   |
| STS Google Drive下载 | https://drive.google.com/drive/folders/1so3747UNlBIB-rwVb2VRPO8-ytpBo3f7?usp=drive\_link |

当前通过验证需要使用的tool版本可以参考链接： [Announcements](https://docs.partner.android.com/partners/announcements/general)

有时候测试套件本身会有BUG，导致一些测试无法通过，此时可以下载dev版本的tool来验证，dev版本XTS下载链接如下：

|                     |                                                                             |
| --------------------- | ----------------------------------------------------------------------------- |
| CTS/VTS Android R   | https://ci.android.com/builds/branches/aosp-android11-tests-dev/grid?       |
| CTS/VTS Android S   | https://ci.android.com/builds/branches/aosp-android12-tests-dev/grid?       |
| CTS/VTS Android U   | https://ci.android.com/builds/branches/aosp-android14-tests-dev/grid?       |
| GSI Image Android R | https://ci.android.com/builds/branches/git\_rvc-tv-gsi-release/grid         |
| GSI Image Android S | https://ci.android.com/builds/branches/git\_sc-tv-gsi-release/grid          |
| GSI Image Android U | https://ci.android.com/builds/branches/git\_udc-tv-gsi-release/grid         |
| TVTS                | https://ci.android.com/builds/branches/git\_main-throttled-tv/grid?legacy=1 |
| GTS Android 10-13   | https://ci.android.com/builds/branches/git\_tm-gts-release/grid?            |
| GTS Android 14      | https://ci.android.com/builds/branches/git\_udc-gts-release/grid?legacy=1   |

注意：

* 下载GSI Image时，在ci.android.com的页面，需要选择gsi\_tv\_arm这个type下的链接
* 下载TVTS时，type选择tvts\_arm
* TVTS不区分Android版本
* GTS的type选择test\_suite\_arm64

## XTS通用知识
### 教学

* 测试命令
  * 跑测前提：假设DUT各设定都已ok，设备adb也都连着
  * 以CTS为例，
    * CTS/VTS/CTSGSI/GTS类似，其中CTSGSI用的是CTS tool
    * cd android-cts/tools
    * ./cts-tradefed，运行会进入cts console：cts-tf >
      * 可以查阅相关命令：help all，更多命令参考：[https://source.android.com/docs/compatibility/cts/command-console-v2?hl=en](https://source.android.com/docs/compatibility/cts/command-console-v2?hl=en)
      * 单测module输入命令：run cts -s board\_ip:5555 or usb device -m “module name” -t “testcase name”
      * fulltest(5片板子or..)命令：run cts -s board1\_ip:5555 -s board2\_ip:5555 -s board3\_ip:5555 -s board4\_ip:5555 -s board5\_ip:5555 --shard-count 5
      * 单测某个module/test or多个，可以连续加--include-filter迭代：--include-filter "module\_name testname" --include-filter "module\_name testname"**​ ​....**
      * 排除某个module/test or多个，可以连续加--exclude-filter迭代：--exclude-filter "module\_name testname" --exclude-filter "module\_name testname" **....**
      * retry命令：
        * l r，可以看到session id/pass/fail等相关信息

        ![](/img/cts-teaching1.png)

			图上的BuildID和Product显示unknown：由于测试的时候加了--skip-device-info (单测加上这个可以适当提速)
		* 1片run retry -s board1\_ip:5555 --retry session\_id
		* 5片run retry -s board1\_ip:5555 -s board2\_ip:5555 -s board3\_ip:5555 -s board4\_ip:5555 -s board5\_ip:5555 --shard-count 5 --retry session\_id
		* XTS retry命令：run retry，现阶段都是这个命令开始，包括CTS/VTS/GTS/CTSGSI/STS/TVTS
	  * ex：一个failure module case：
		* -m CtsHdmiCecHostTestCases  //单测一个module
		* -m CtsHdmiCecHostTestCases -t [android.hdmicec.cts.tv](http://android.hdmicec.cts.tv/).HdmiCecTvOneTouchPlayTest#cect_11_1_1_1_RespondToImageViewOn  //单测一个testcase
		* 下面是一个module，有三个fail，每个fail项的testcase，都可以用“-m -t”单测

		![](/img/cts-teaching2.png)

  * CTS-on-GSI
    * 烧录GSI system.img
    * **和cts共用一套tool**
    * fulltest命令：run cts-on-gsi
    * retry命令：run retry
    * 其他命令参数参考CTS
  * TVTS要留意device发布版本带来的区别：
    * devices发布IR版本：run tvts-full-cert
    * devices发布MR版本：run tvts-maint-cert
    * retry命令：run retry
    * 其他命令参数参考CTS
  * GTS：
    * fulltest命令：run gts
    * retry命令：run retry
    * 其他命令参数参考CTS
  * VTS：
    * 烧录GSI system.img + vendor_boot-debug.img or boot-debug.img
    * fulltest命令：run vts
    * retry命令：run retry
    * 其他命令参数参考CTS
  * STS：
    * fulltest命令：run sts-dynamic-full
    * retry命令：run retry
    * 其他命令参数参考CTS

### TOOL命令

|命令         |作用                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------- |
| l r        | 查看结果                                                                                    |
| l i        | 查看目前跑测中的invocations                                                                 |
| l d        | 查看连接中的DUT信息，只有available的DUT才能开始跑测                                         |
| `i {n}` stop | 发出将`{n}`号invocation停止的请求，会等待当前测试进程停止，测试卡死但是想出报告的时候可以使用 |