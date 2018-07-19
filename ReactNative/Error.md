### 에러 1
>realm install 후 다음과 같은 에러가 발생 
<pre>
<code>
:realm:generateReleaseBuildConfig FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':realm:generateReleaseBuildConfig'.
> java.io.IOException: Could not delete path 'D:\React\FullApp\node_modules\real
m\android\build\generated\source\buildConfig\release\io\realm'.

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug
option to get more log output.

BUILD FAILED

Total time: 50.168 secs
Could not install the app on the device, read the error above for details.
Make sure you have an Android emulator running or a device connected and have
set up your Android development environment:
https://facebook.github.io/react-native/docs/android-setup.html
</code>
</pre>

#### 처리내용
<pre>
<code>
cd android
gradlew clean
cd ..
react-native run-android
</code>
</pre>



### 에러 2
<pre>
<code>
    async setup(testName) {
        var count = await  this.count();
        if (testName == 'enumeration' || testName == 'querycount' || testName == 'queryenum') {
</code>
</pre>

##### 처리결과
await에서 한칸 더 띄우니 되었다?
