---
sidebar_position: 3
---

# GTS

## 常见问题

### WvtsDeviceTestCases

#### 常见问题：com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMCencSubSampleL1WithUHD60和com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMCencSubSampleL3WithUHD60    测项容易fail

解决方案：这两个测项需要在线播放UHD60的高清视频，所以对网络带宽的要求比较高，通常是网络带宽不够导致，可以尝试调整网络环境。

### GtsReadLogStringTest

#### 常见问题：There were 4 failures: com.android.tradefed.targetprep.TargetSetupError[AAPT\_PARSER\_FAILED|520050|DEPENDENCY\_ISSUE]:

解决方案：server端aapt tool版本太旧导致，需要更新aapt tool
