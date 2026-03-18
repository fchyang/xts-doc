---
sidebar_position: 8
---

# Setting

XTS环境分成Server端（即Host端）和DUT端（即Device端）两部分。

## Server端

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

### For TVTS

参考以下文档进行配置： [TVTS设置](https://docs.partner.android.com/tv/test/tvts/run?authuser=3) Unbuntu在较新的版本中，出于安全考虑，不再允许用户直接安装python库，推荐安装pyenv进行python环境管理，Unbuntu的安装命令如下：

```Shell
# 更新包列表
sudo apt update

# 安装编译Python所需的依赖库
sudo apt install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
xz-utils tk-dev libffi-dev liblzma-dev python3-openssl git

# 安装pyenv
# 这个命令会下载并执行安装脚本，将pyenv及其一些有用的插件（如 pyenv-virtualenv）
# 安装到你的 home 目录下的 ~/.pyenv 文件夹中
curl https://pyenv.run | bash

# 配置.bashrc
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

# 查看可安装的Python版本
pyenv install --list

# 安装特定版本的Python
pyenv install 3.12.3

# 查看已安装的版本
pyenv versions

# 设置全局默认的Python版本：
pyenv global 3.12.3

# 为某个特定项目设置Python版本
pyenv local 3.11.0

# 其他可具体参考pyenv的用法
```

对于`TvtsMemoryScoreTestCases`和`TvtsMemoryScoreTestCasesV2`这两个测项，需要安装perfetto和protobuf两个python库，安装命令如下：

```Shell
pip install perfetto
pip install protobuf
```

其中，perfetto库需要CPU支持AVX2、BMI2等指令，可以通过`cat /proc/cpuinfo`命令查看。

对于`TvtsEnduranceTestCases`一项，需要安装webfs和webfsd，命令如下：

```Shell
sudo apt install webfs  webfsd
sudo mkdir -m 777 -p /var/www/html
```

### For CTS

对于`CtsHdmiCecHostTestCases`，参考以下两个文档： [cec\_adapter.md](https://android.googlesource.com/platform/cts/+/refs/heads/master/hostsidetests/hdmicec/cec_adapter.md) [README.md](https://android.googlesource.com/platform/cts/+/refs/heads/master/hostsidetests/hdmicec/README.md)

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

## Device端

### bootcode设定

* 重启，并在串口按住ESC，DUT进入bootcode模式
* 串口输入：env set androidboot cts
* 串口输入：env save
* 串口输入：re


### TV UI设定

* settings -> system -> language -> United States
* settings -> System -> Power & Energy -> ShutOff Timer ->When inactiver -> Never
* settings -> System -> Power & Energy -> ShutOff Timer ->When watching -> Never
* settings -> System -> No signal sleep timer -> Never
* settings -> System -> About -> Android TV OS build，连续按6次进入开发者模式，即Developer options
	* settings -> System -> Developer options -> Usb debugging enable (for adb)
* settings -> System ->Developer options -> Stay awake -> enable

>其中，打开开发者模式允许USB调试的步骤，除了UI以外，也可以通过在串口中输入如下Shell命令设置：
> - settings put global development_settings_enabled 1
> - settings put global adb_enabled 1


> 特别地，如果手中没有蓝牙遥控器，无法通过正常的流程进入Android TV的主页，需要跳过setup wizard的界面，可以在shell中输入以下命令：
> - settings put global google_remote_pairer 0
> - reboot


### Monitor UI设定

Monitor也需要进行TV设定中的所有设定，并且在UI上额外执行以下设定：

* Settings > system > Monitor > Auto Switch Settings > off
* Settings > Network & Internet > Wifi Configs > Network Standby > on(R+3.0)

> 除了UI设定以外，Monitor还需要进行以下shell命令设定：
> - settings put global auto_switch_behavior 2
> - settings put global shortcut_menu_hint 1

### Google play store设定
* Google play store-> Play Protect->Scan apps with play Protect，关闭安装测试apk时的弹窗提示，否则可能挡掉一些测项的UI检测。
* Google play store -> Settings -> Auto-update apps，将自动更新关闭，手动更新所有的APP

### RKP设定

* RPK注册，参考[RKP注册](https://wiki.realtek.com/display/MDKB/%5BAndroid-14%5D+Android+RKP+registration)，通过shell命令：rtk\_system\_info --check，可以检查各种key的烧录情况，确保key的烧录完整
  * getcsr：rkp_factory_extraction_tool --output_format build+csr >> ./csrs.json
  * upload csr：https://partner.android.com/approvals/upload-rkp (for customer)
* 如果拿到的新板子，rkp注册了，各种key也烧录了，但rtk_system_info check发现Attestation IDs栏位确是Unverified，
  * 这样的话GTS会有很多service account的issues，即便已经导入了APE API Key
  
  ![](/img/rkp-verify.png)
  
  * 如果出现上述情况：请执行如下三个命令之后再去用rtk_system_info --check
    * getprop ro.serialno | xxd -r -p > /data/local/tmp/mac.bin;
	* mgmtkey_client --key mac_sn --install /data/local/tmp/mac.bin;
	* mgmtkey_client --burn-id

### 网络环境配置

* 路由器的WiFi，把2.4G跟5G频段分开，不要使用混合模式，需要连接WiFi的测项，仅连接2.4G or 5G频段，推荐2.4G
* Android 14+，DUT和server都要能访问google，所以需要能访问外网的网络
* Android 13以下的XTS tool，server端不需要访问Google，但是DUT仍然需要

特别地，对于WiFi相关的测项，DUT需要连接WiFi，但是Android TV在连接有线网时，无法连接WiFi，而如果server跟DUT通过WiFi的ip地址进行ADB连接，容易出现ADB断连导致fail，解决方案有2个：

:::tip[MY TIP]
1. 如果DUT支持USB ADB连接，DUT不连接有线网，只连接WiFi，server端通过USB线和DUT进行ADB连接
2. DUT不支持USB ADB，在路由器中进行设置(设定上网时间或禁网)，关闭DUT的有线网的互联网访问权限，拔掉DUT的有线网，连接WiFi以后，再给DUT插上有线网，这样可以实现DUT的两个IP地址同时存在，server端则通过DUT的有线网IP地址进行ADB连接
    * 此时有线网不能上网，只提供IP for adb
:::

### 刷GSI Image

**注意：** 跑测CTS-on-GSI时，需要刷GSI Image，跑测VTS时需要刷GSI Image和vendor\_boot\_debug

刷GSI Image步骤：
>1. 重启DUT并在串口按住ESC键，进入bootcode模式
>2. 在串口输入：env set OEMLock off
>3. 在串口输入：env save
>4. 在串口输入：usb\_gadget disable
>5. 在串口输入：re
>6. server端输入fastboot -s `tcp:{ip}` flash system `system.img`
>7. server端输入fastboot -s `tcp:{ip}` -w --fs-options=casefold

将上面的`{ip}`替换为DUT的实际`ip`地址，`system.img`在[GSI Image](https://docs.partner.android.com/tv/test/android/gsi?authuser=3)下载。 刷`vendor_boot_debug.img`步骤：

>1. 重复刷GSI Image的步骤1-5
>2. server端输入fastboot -s `tcp:{ip}` flash vendor_boot `vendor_boot_debug.img`
