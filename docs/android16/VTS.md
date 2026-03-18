---
sidebar_position: 4
---

# VTS

## 常见问题

### FastbootGetvarUserspaceTest和FastbootVerifyUserspaceTest

#### 常见问题：这两个module容易跑不完

解决方案：需要把server上ipv6开关打开，否则会导致DUT进入fastboot界面以后不返回normal mode，进而导致测试失败

![](/img/fastboot1.png)

### VtsAidlKeyMintTargetTest

#### 常见问题：PerInstance/AuthTest#TimeoutAuthentication/0\_android\_hardware\_security\_keymint\_IKeyMintDevice\_default

解决方案：和google keymint server有关，不同时间测试结果不同，后续optee owner在根据testcase算authtoken timeout的时间加了offset，这样可以动态调整

### vts\_ltp\_test\_arm

#### 问题：controllers.memcontrol02\_32bit#controllers.memcontrol02\_32bit

解决方案：子测项之间有依赖，跑单个测项会fail，可以用-m参数跑整个module，就可以pass。

### VtsAidlHalDrmTargetTest

#### 问题：module跑不完，incomplete

解决方案：这一项需要连接WiFi跑测，建议使用无网络的eth作为adb连接端口，然后连接有网络的WiFi。