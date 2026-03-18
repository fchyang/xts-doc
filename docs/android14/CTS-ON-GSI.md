---
sidebar_position: 2
---

# CTSGSI

## 刷GSI步骤

需要用到Android platform tools，建议保持下载最新版

### Device上：
- reboot到bootcode，在bootcode下设置:
  + env set OEMLock off 
  + usb_gadget disable  
    + 平台supoort otg/usb adb，但想通过tcp/ip刷gsi，需要在bootcode下设定usb_gadget disable，不support OTG/USB adb，则不需要  
	+ 平台supoort otg/usb adb，要通过otg刷gsi，需要usb_gadget enable，一般support otg的平台，usb_gadget默认是enable
  + env save
- 进入fastbootd界面：
    + boot下直接输入boot_fastboot(会有进入待机的情况，那用下面的方法)
    + re，进入normal mode，串口reboot fastboot命令，进入fastbootd界面
### Host server上: 
#### flash gsi system
```
- fastboot flash over otg/usb
  fastboot -s {device serial number} flash system system.img
- fastboot flash over tcp/ip
  fastboot -s {tcp:ip:5554} flash system system.img
```
若提示空间不够，可以删除product_a，再去flash 
```
fastboot -s tcp:ip:5554 delete-logical-partition product_a
```

#### erase data
```
fastboot -s tcp:ip:5554 -w --fs-options=casefold，
Tips: 若没有casefold的设置，可能导致data分区缺少feature
```
也可以从
`GSI UI settings -> Device Preferences -> About -> Factory reset`，或进入recovery从UI上选择·wipe data·，
#### 重启平台
`fastboot -s tcp:ip:5554 reboot`，或是平台串口里下reboot