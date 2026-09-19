@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Maven Wrapper startup batch script, version 3.2.0
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "__MVNW_ARG0_NAME__=%~nx0")
@SET ___MVNW_INTF=.%%MVNW_REPOURL:~-4%%
@IF "%%___MVNW_INTF%%"==".zip" (SET "___MVNW_REPOURL_TYPE__=zip") ELSE (SET "___MVNW_REPOURL_TYPE__=")

@SET MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
@IF NOT "%MAVEN_PROJECTBASEDIR%"=="" goto endDetectBaseDir

@SET EXEC_DIR=%CD%
@SET WD=%EXEC_DIR%
:findBaseDir
@IF EXIST "%WD%\.mvn" goto baseDirFound
@cd ..
@IF "%WD%"=="%CD%" goto baseDirNotFound
@SET WD=%CD%
@goto findBaseDir

:baseDirFound
@SET MAVEN_PROJECTBASEDIR=%WD%
@cd "%EXEC_DIR%"
@goto endDetectBaseDir

:baseDirNotFound
@SET MAVEN_PROJECTBASEDIR=%EXEC_DIR%
@cd "%EXEC_DIR%"

:endDetectBaseDir
@IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties" goto end

@SET MVNW_USERNAME=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties

@SET DOWNLOAD_URL=
@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%MVNW_USERNAME%") DO (
    @IF "%%A"=="distributionUrl" SET "DOWNLOAD_URL=%%B"
)

@SET MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6-bin\apache-maven-3.9.6

@IF EXIST "%MAVEN_HOME%\bin\mvn.cmd" goto init

@echo Downloading Maven...
@powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6-bin.zip' }"
@powershell -Command "Expand-Archive -Path '%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6-bin.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists\' -Force"

:init
@SET MAVEN_CMD_LINE_ARGS=%*
"%MAVEN_HOME%\bin\mvn.cmd" %MAVEN_CMD_LINE_ARGS%

:end
@ENDLOCAL
