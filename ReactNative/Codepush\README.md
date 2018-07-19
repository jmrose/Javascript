## Sample Source

```codepush

  CodePush.getCurrentPackage().then((localPackageInfo) => {
     console.log('localPackageInfo', localPackageInfo);
  });

  CodePush.checkForUpdate().then((remotePackageInfo)=>{
     console.log('remotePackageInfo', remotePackageInfo);
  });



CodePush.sync(
{
    updateDialog:{
        title: "새로운 업데이트가 존재합니다",
        optionalUpdateMessage : "지금 업데이트하시겠습니까?",
        mandatoryContinueButtonLabel : "계속",
        mandatoryUpdateMessage : "업데이트를 설치해야 사용할 수 있습니다.",
        optionalIgnoreButtonLabel : "나중에",
        optionalInstallButtonLabel : "업데이트"
    }, installMode:CodePush.InstallMode.IMMEDIATE },
    status => {
        switch(status){
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({showDownloadingModal:true});
                //this._modal.open();
            break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({showInstalling:true});
            break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                this._onClose();
                this.setState({showDownloadingModal:false});
            break;
            default:
            break;
        }
    },
    ({receivedBytes, totalBytes})=>{
        this.setState({downloadProgress:receivedBytes/totalBytes*100});
    }
);

AppState.addEventListener('change', this.handleStateChange);

//***************   구글  버젼 체크
fetch('https://play.google.com/store/apps/details?id=com.dongjin.Info21c&hl=kr')
.then(function(response) {
    let regexp = /(softwareVersion([^<]+))/g;
    let remoteVersion = (response._bodyText).match(regexp);
    remoteVersion = (remoteVersion+'').replace(/softwareVersion">/g,'');
    remoteVersion = (remoteVersion+'').replace(/ /g, '');

    remoteVersion = '0';
    console.log('google version name', remoteVersion);
    if( remoteVersion > DeviceInfo.getVersion() ){
        Alert.alert(null,
            '업데이트를 설치해야 사용할 수 있습니다.',
            [
                {text:'확인', onPress:()=>{
                Linking.canOpenURL('market://details?id=com.dongjin.Info21c').then(supported => {
                    if (!supported) {
                        console.log('not supported');
                    } else {
                        return Linking.openURL('market://details?id=com.dongjin.Info21c');
                    }
                }).catch(err => console.log('error', err));
             }}
            ]
        );
    }
}).catch((error) => {
});
/***********************************************/


CodePush.getCurrentPackage().then((localPackageInfo) => {
    console.log('[localPackageInfo]', localPackageInfo);
});

CodePush.checkForUpdate().then((remotePackage)=>{
    if(!remotePackage){
    }else{
        console.log('[remotePackage]', remotePackage);
        if(!remotePackage.failedInstall){
            remotePackage.download((downloadProgress) => {
                console.log('[downloadProgress]', downloadProgress);
            }).then((localPackage) => {
                CodePush.notifyAppReady();
                // CodePush.sync();
                localPackage.install(CodePush.InstallMode.IMMEDIATE, 0);
             });
        }
    }
}, (error)=>{
    console.log('error', error);
});

```
