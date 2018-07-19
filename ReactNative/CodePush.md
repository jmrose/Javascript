```codepush
# 계정만들기
code-push register

#로그인
code-push login

# 로그아웃
code-push logout

# 로그인 사용자 정보보기
code-push whoami

# 앱추가
code-push app add Info21c-Android android react-native
code-push app add Info21c-Android ios react-native

# 앱이름변경
code-push app rename Info21c-Android Bidq-Android

# 앱 지우기
code-push app rm Info21c-Android

# 앱 리스트
code-push app ls

# 앱에 collaborator 추가 관리자 등록
code-push collaborator add <appName> <collaboratorEmail>

code-push collaborator rm <appName> <collaboratorEmail>
code-push collaborator ls <appName>

# release 하기
code-push release-react bidqcokr/Info21c-Android android

code-push release-react Info21c-Android android --targetBinaryVersion "1.1.0"

#  옵션
# -m : mandatory
# --description : 설명
# --deployment : 배포 이름 지정
# --targetBinaryVersion : 배포 대상 지정 ~1.1  => 1.1 이상?

code-push release-react Project-Android android -m --description "test" --targetBinaryVersion "~1.1

code-push release-react Project-Android android -m --targetBinaryVersion "~1"

# release 지우기
code-push deployment clear Project-Android Staging

# release history
code-push deployment history Project-Android Staging

# 배포 앱 등록   Staging / Production
code-push deployment add <appName> <deploymentName>
code-push deployment add Project-Android Staging

code-push deployment rm <appName> <deploymentName>
code-push deployment rename <appName> <deploymentName> <newDeploymentName>

# 배포 앱 리스트 ( 키값 포함 )
code-push deployment ls <appName> [--displayKeys|-k]
code-push deployment ls Project-Android -k

# Staging => Production 으로 배포
code-push promote Project-Android Staging Production

# 사용자 20%만 프로덕션 업데이트
code-push promote Project-Android Staging Production -r 20%

# 충돌 보고서 또는 고객 피드백 후 다음(단계적으로 적용할 경우) 전체 잠재 고객에게 확장 설치
code-push patch Project-Android Production -r 100%
```
