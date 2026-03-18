---
sidebar_position: 7
---

# CTS-V

## 注意事项

### CTS Verifier安装和权限

* 在[https://source.android.google.cn/docs/compatibility/cts/downloads](https://source.android.google.cn/docs/compatibility/cts/downloads) 下载DUT对应的安卓版本的CTS Verifier APK包，包内包含多个apk，DUT一般只需要安装CtsVerifier.apk
* 在DUT的settings界面中，把CTS Verifier的权限全部打开
* 参考 [https://source.android.google.cn/docs/compatibility/cts/verifier](https://source.android.google.cn/docs/compatibility/cts/verifier) 在DUT的shell中执行以下命令：

**CTS Verifier权限设置**

```Shell
- settings put global hidden_api_policy 1  
- appops set com.android.cts.verifier android:read_device_identifiers allow  
- appops set com.android.cts.verifier MANAGE_EXTERNAL_STORAGE 0  
- am compat enable ALLOW_TEST_API_ACCESS com.android.cts.verifier  
- appops set com.android.cts.verifier TURN_SCREEN_ON 0  
```

### 其它硬件需求

除了DUT以外，CTS Verifier还需要一台辅助设备，需要满足以下条件：

* 兼容的Bluetooth, Wi-Fi direct, Wi-Fi Aware, UWB (如果DUT支持UWB)
* NFC host card emulation (HCE) implementation

此外，还需要一台路由器，配置WiFi SSID和密码，不连接互联网，只提供局域网。

## 常见问题

### 问题：CTS Verifier闪退

解决方案：通常是由于权限没有给全，除了settings UI中的权限以外，通过shell赋予的隐藏权限也要确保打开。

### 问题：USB Device Test，测试过程中不弹窗，导致fail

解决方案：使用DUT的非OTG口连接辅助设备。
