interface INavigator {
    checkPermission?: (
        permission?:
            | 'CAMERA'
            | 'CONTACTS'
            | 'GALLERY'
            | 'LOCATION'
            | 'NOTIFITION'
            | 'RECORD'
            | 'SHORTCUT'
            | any,
    ) =>
        | 'authorized'
        | 'undetermined'
        | 'notdeny'
        | 'unknown'
        | 'unsupported'
        | any;
    closeSplashscreen?: () => any;
    hasSplashscreen?: () => boolean;
    updateSplashscreen?: (options: ISplashscreenOptions) => any;
    createShortcut?: (
        options?: IShortcutOptions,
        successCallback?: (
            event:
                | any
                | 'existing'
                | 'none'
                | 'unsupported'
                | 'unknown'
                | false
                | true,
        ) => any,
    ) => any;
    hasShortcut?: (
        options?: IShortcutOptions,
        successCallback?: (
            event:
                | any
                | 'existing'
                | 'none'
                | 'unsupported'
                | 'unknown'
                | false
                | true,
        ) => any,
    ) => any;
    isBackground?: () => boolean;
    isFullscreen?: () => boolean;
    isLogs?: () => boolean;
    setFullscreen?: (isFull: boolean) => any;
    setLogs?: (isLog: boolean) => any;
    setStatusBarBackground?: (color: string) => any;
    getStatusBarBackground?: () => string;
    setStatusBarStyle?: (style: 'dark' | 'light') => any;
    getStatusBarStyle?: () => any;
    getStatusbarHeight?: () => number;
    isImmersedStatusbar?: () => boolean;
    setUserAgent?: (useragent?: string, checkplus?: boolean) => any;
    getUserAgent?: () => string;
    setCookie?: (url: string, value: string) => any;
    getCookie?: (url: string) => string;
    removeAllCookie?: () => any;
    removeCookie?: (url: string) => any;
    removeSessionCookie?: () => any;
}

interface IShortcutOptions {
    name?: string;
    icon?: string;
    toast?: string;
    extra?: any;
    classname?: string;
    force?: boolean;
}

interface ISplashscreenOptions {
    image?: string;
    autoclose?: boolean;
    autoclose_w2a?: boolean;
    delay?: boolean;
    delay_w2a?: number;
}

interface IAcceleration {
    xAxis?: number;
    yAxis?: number;
    zAxis?: number;
}

interface IAccelerationOption {
    frequency?: string;
}

interface IAccelerometer {
    getCurrentAcceleration?: (
        successCB?: (v?: IAcceleration) => any,
        errorCB?: Function,
    ) => void;
    watchAcceleration?: (
        successCB?: Function,
        errorCB?: Function,
        option?: any,
    ) => any;
    clearWatch?: (watchId?: any) => any;
    Acceleration?: IAcceleration;
    AccelerationOption?: IAccelerationOption;
}

interface IBarcode {
    QR?: number;
    EAN13?: number;
    EAN8?: number;
    AZTEC?: number;
    DATAMATRIX?: number;
    UPCA?: number;
    UPCE?: number;
    CODABAR?: number;
    CODE39?: number;
    CODE93?: number;
    CODE128?: number;
    ITF?: number;
    MAXICODE?: number;
    PDF417?: number;
    RSS14?: number;
    RSSEXPANDED?: number;
    scan?: (
        path?: string,
        successCB?: (type?: number, code?: string, file?: string) => any,
        errorCB?: Function,
        filters?: any,
    ) => any;
    create?: (
        id?: string,
        filters?: Array<number>,
        styles?: IBarcodeStyles,
    ) => any;
    getBarcodeById?: (id?: number) => any;
    Barcode?: (
        id?: string,
        filters?: Array<number>,
        styles?: IBarcodeStyles,
    ) => any;
    BarcodeStyles?: IBarcodeStyles;
    BarcodeOptions?: any;
}

interface IBarcodeOptions {
    conserve?: boolean;
    filename?: string;
    vibrate?: boolean;
    sound?: string;
}

interface IBarcodeStyles extends IPopPosition {
    background?: string;
    frameColor?: string;
}

interface IBarcodeObj {
    start?: (option?: IBarcodeOptions) => any;
    cancel?: () => any;
    close?: () => any;
    setFlash?: (open) => any;
    onmarked?: () => any;
    onerror?: () => any;
}

interface Preview_IEvents {
    plusready?: string;
    pause?: string;
    resume?: string;
    netchange?: string;
    newintent?: string;
    plusscrollbottom?: string;
    error?: string;
    background?: string;
    foreground?: string;
    trimmemory?: string;
    splashclosed?: string;
}

interface IDevice {
    imei?: string;
    imsi?: string;
    model?: string;
    vendor?: string;
    uuid?: string;
    dial?: (number?: string, confirm?: boolean) => any;
    deep?: (time?: number) => any;
    vibrate?: (milliseconds?: number) => any;
    setWakelock?: (lock?: boolean) => any;
    isWakelock?: () => boolean;
    setVolume?: (volume?: number) => any;
    getVolume?: () => number;
    screen?: IScreen;
    display?: IDisplay;
    networkinfo?: INetworkinfo;
    os?: IOS;
}

interface IDisplay {
    resolutionHeight?: number;
    resolutionWidth?: number;
}

interface IScreen {
    resolutionHeight?: number;
    resolutionWidth?: number;
    scale?: number;
    dipX?: number;
    dipY?: number;
    setBrightness?: (brightness?: number) => any;
    getBrightness?: () => number;
    lockOrientation?: (
        orientation?:
            | 'landscape'
            | 'portrait-primary'
            | 'portrait-secondary'
            | 'landscape-primary'
            | 'landscape-secondary',
    ) => any;
    unlockOrientation?: (light?: number) => any;
}

interface INetworkinfo {
    CONNECTION_UNKNOW?: any;
    CONNECTION_NONE?: any;
    CONNECTION_ETHERNET?: any;
    CONNECTION_WIFI?: any;
    CONNECTION_CELL2G?: any;
    CONNECTION_CELL3G?: any;
    CONNECTION_CELL4G?: any;
    getCurrentType?: () => number;
}

interface IOS {
    language?: string;
    version?: string;
    name?: string;
    vendor?: string;
}

interface ICamera {
    getCamera?: (index?: number) => any;
    Camera?: ICameraObj;
    CameraOptions?: ICameraOptions;
    PopPosition?: IPopPosition;
}

interface ICameraObj {
    supportedImageResolutions?: Array<string>;
    supportedVideoResolutions?: Array<string>;
    supportedImageFormats?: Array<string>;
    supportedVideoFormats?: Array<string>;
    captureImage?: (
        successCB?: (capturedFile?: string) => any,
        errorCB?: Function,
        option?: ICameraOptions,
    ) => any;
    startVideoCapture?: (
        successCB?: (capturedFile?: string) => any,
        errorCB?: Function,
        option?: ICameraOptions,
    ) => any;
    stopVideoCapture?: () => any;
}

interface ICameraOptions {
    filename?: string;
    format?: string;
    index?: string;
    resolution?: string;
    popover?: IPopPosition;
}

interface IPopPosition {
    top?: string;
    left?: string;
    width?: string;
    height?: string;
    position?: 'static' | 'absolute';
}

interface IContacts {
    ADDRESSBOOK_PHONE?: any;
    ADDRESSBOOK_SIM?: any;
    getAddressBook?: (
        type?: any,
        addressbookCB?: (addressBook?: any) => any,
    ) => any;
    AddressBook?: any;
    Contact?: any;
    ContactField?: any;
    ContactName?: any;
    ContactAddress?: any;
    ContactOrganization?: any;
    ContactFindOption?: any;
    ContactFindFilter?: any;
}

interface IDownloader {
    createDownload?: (
        url?: string,
        options?: IDownloadOptions,
        completedCB?: Function,
    ) => any;
    enumerate: (
        enumCB?: (download?: IDownloader, status?: number) => any,
        state?: number,
    ) => any;
    clear?: (state?: number) => any;
    startAll?: () => any;
    Download?: IDownloadObj;
    DownloadEvent?: any;
    DownloadState?: any;
    DownloadOptions?: IDownloadOptions;
    downloadState_preview?: Preview_IDownloaderState;
}

interface IDownloadObj {
    id?: string;
    url?: string;
    state?: number;
    options?: IDownloadOptions;
    filename?: string;
    downloadedSize?: number;
    totalSize?: number;
    abort?: () => any;
    addEventListener?: (
        event?: string,
        listener?: Function,
        capture?: boolean,
    ) => any;
    getAllResponseHeaders?: () => string;

    getResponseHeader?(headerName?: string): string;

    pause?(): any;

    resume?(): any;

    setRequestHeader?(headerName?: string, headerValue?: string): any;

    start?(): any;
}

interface IDownloadOptions {
    method?: string;
    data?: string;
    filename?: string;
    priority?: number;
    timeout?: number;
    retry?: number;
    retryInterval?: number;
}

interface Preview_IDownloaderState {
    unStart_undefined?: undefined;
    start_0?: 0;
    start_quest_1?: 1;
    request_2?: 2;
    downloadData_3?: 3;
    didDownloadData_4?: 4;
    downloadTaskPause_5?: 5;
    allDownloadStatus__1?: -1;
}

interface IRuntime {
    appid?: string;
    arguments?: string;
    channel?: string;
    launcher?: string;
    origin?:
        | string
        | 'default'
        | 'stream'
        | 'push'
        | 'scheme'
        | 'barcode'
        | 'silent'
        | 'speech'
        | 'favorite';
    version?: string;
    innerVersion?: string;
    launchLoadedTime?: number;
    processId?: string;
    startupTime?: number;
    getProperty?: (appid: string, getPropertyCB: Function) => any;
    install?: (
        filePath?: string,
        options?: IWidgetOptions,
        installSuccessCB?: (widgetInfo?: IWidgetInfo) => any,
        installErrorCB?: Function,
    ) => any;
    quit?: () => any;
    restart?: () => any;
    setBadgeNumber?: (tipNumber: number) => any;
    openURL?: (url: string, errorCB?: Function, identity?: string) => any;
    openWeb?: (url) => any;
    openFile?: (filepath, options?: IOpenFileOptions, errorCB?: Function) => any;
    processDirectPage?: () => any;
    launchApplication?: (appInf: IApplicationInf, errorCB: Function) => any;
    isApplicationExist?: (appInf: IApplicationInf) => any;
    isCustomLaunchPath?: () => any;
}

interface IOpenFileOptions {
    pname?: string;
    popover?: IPopPosition;
}

interface IApplicationInf {
    pname?: string;
    action?: string;
    extra?: string;
}

interface IWidgetOptions {
    force?: boolean;
}

interface IWidgetInfo {
    appid: string; //(String 类型 )应用的APPID
    version: string; // (String 类型 )应用的版本号
    name: string; // (String 类型 )应用的名称
    description: string; // (String 类型 )应用描述信息
    author: string; // (String 类型 )应用描述信息
    email: string; // (String 类型 )开发者邮箱地址
    license: string; // (String 类型 )应用授权描述信息
    licensehref: string; // (String 类型 )应用授权说明链接地址
    features: Array<string>; // (String[] 类型 )应用许可特性列表
}

interface IKey {
    addEventListener: (
        keyevent:
            | any
            | 'backbutton'
            | 'keydown'
            | 'keyup'
            | 'longpressed'
            | 'menubutton'
            | 'searchbutton'
            | 'volumeupbutton'
            | 'volumedownbutton',
        listener: (keyEvent: IKeyEvent) => any,
        capture?,
    ) => any;
    hideSoftKeybord: () => any;
    setAssistantType: (
        type:
            | string
            | 'nick'
            | 'address'
            | 'tel'
            | 'email'
            | 'company'
            | 'tax'
            | 'id'
            | 'none',
    ) => any;
    showSoftKeybord: () => any;
    removeEventListener: (
        evnet:
            | any
            | 'backbutton'
            | 'keydown'
            | 'keyup'
            | 'longpressed'
            | 'menubutton'
            | 'searchbutton'
            | 'volumeupbutton'
            | 'volumedownbutton',
        listener: (keyEvent: IKeyEvent) => any,
    ) => any;
}

interface IKeyEvent {
    keyCode: string;
}

interface INativeUI {
    actionSheet: (
        actionsheetStyle: IActionSheetStyles,
        actionsheetCallback?: ({index}) => any,
    ) => any;
    alert: (
        message: string,
        alertCB?: ({index}) => any,
        title?: string,
        buttonCapture?: string,
    ) => any;
    confirm: (
        message: string,
        confirmCB?: ({index}) => any,
        options?: IConfirmOptions,
    ) => any;
    closeWaiting: () => any;
    closeToast: () => any;
    previewImage: (urls: Array<string>, options?: IPreviewImageOptions) => any;
    showWaiting: (title?: string, options?: IWaitingOptions) => any;
    pickDate: (
        successCB?: (data) => any,
        errorCB?: ({code, message}) => any,
        options?: IPickTimeOption,
    ) => any;
    pickTime?: (
        successCB?: (data) => any,
        errorCB?: ({code, message}) => any,
        options?: IPickTimeOption,
    ) => any;
    prompt?: (
        message?: string,
        promptCB?: ({index, value}) => any,
        title?: string,
        tip?: string,
        buttons?: Array<string>,
    ) => any;
    toast?: (message?: string, options?: IPickTimeOption) => any;
}

interface IPickTimeOption {
    time?: any;
    title?: string;
    is24Hour?: boolean;
    popover?: IPopPosition;
}

interface IActionSheetStyles {
    title?: string;
    cancel?: string;
    buttons: Array<IActionButtonStyles>;
}

interface IActionButtonStyles {
    color?: string;
    title?: string;
    style?: string;
}

interface IConfirmOptions {
    title?: string;
    buttons?: string;
    verticalAlign?: string;
}

interface IPreviewImageOptions {
    background?: string;
    current?: string;
    indicator?: string;
    loop?: boolean;
}

interface IWaitingOptions {
    width?: string;
    height?: string;
    color?: string;
    size?: string;
    textalign?: string;
    padding?: string;
    background?: string;
    style?: string;
    modal?: boolean;
    round?: string;
    padlock?: string;
    back?: string;
    loading?: IWaitingLoadingOptions;
}

interface IWaitingLoadingOptions {
    display?: string;
    height?: string;
    icon?: string;
    interval?: number;
}

interface IToastOptions {
    align?: string;
    duration?: 'long' | 'short';
    icon?: string;
    iconWidth?: string;
    iconHeight?: string;
    style?: string;
    type?: string;
    richTextStyle?: IRichTextStyles;
    verticalAlign?: 'top' | 'center' | 'bottom';
}

interface IRichTextStyles {
    align?: 'left' | 'center' | 'right';
    family?: string;
    fontSrc?: string;
    onClick?: (event: IRichTextClickedCallbackEvent) => any;
}

interface IRichTextClickedCallbackEvent {
    tagName?: string;
    href?: string;
    src?: any;
}

interface IFingerprint {
    isSupport: () => boolean;
    isKeyguardSecure: () => boolean;
    isEnrolledFingerprints: () => boolean;
    authenticate: (
        successCB: Function,
        errorCB: Function,
        options?: IAuthenticateOptions,
    ) => any;
    cancel: () => any;
}

interface IAuthenticateOptions {
    message?: string;
}

interface IAudio {
    ROUTE_SPEAKER: any;
    ROUTE_EARPIECE: any;
    getRecorder: () => IAudioRecorder;
    createPlayer: (path: string) => any;
}

interface IAudioRecorder {
    supportedSamplerates: Array<string>;
    supportedFormats: Array<string>;
    record: (
        option?: IRecordOption,
        successCB?: (file) => any,
        errorCB?: Function,
    ) => any;
    stop: () => any;
}

interface IRecordOption {
    filename?: string;
    samplerate?: string;
    format?: string;
}

interface IGallery {
    pick: (
        successCB?: (file) => any,
        errorCB?: Function,
        options?: IGalleryOptions,
    ) => any;
    save: (path: string, successCB?: Function, errorCB?: Function) => any;
}

interface IGalleryOptions {
    animation?: boolean;
    filename?: string;
    filter?: IGalleryFilter;
}

interface IGalleryFilter {
    image?: string;
    video?: string;
    none?: string;
}

interface IGeolocation {
    getCurrentPosition?: (
        successCB?: (position: IPosition) => any,
        errorCB?: Function,
        option?: IPositionOptions,
    ) => any;
    watchPosition: (
        successCB?: Function,
        errorCB?: Function,
        option?: IPositionOptions,
    ) => number;
    clearWatch: (watchId: number) => any;
}

interface IPositionOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    provider?: 'system' | 'baidu' | 'amap';
}

interface IPosition {
    coords?: ICoordinates;
    coordsType?: 'gps' | 'gcj02' | 'bd09' | 'bd09ll';
    timestamp?: number;
    address?: IAddress;
    addresses?: string;
}

interface ICoordinates {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    accuracy?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
}

interface IAddress {
    country?: string;
    province?: string;
    city?: string;
    district?: string;
    street?: string;
    streetNum?: string;
    poiName?: string;
    postalCode?: string;
    cityCode?: string;
}

interface IIO {
    PRIVATE_WWW: any;
    PRIVATE_DOC: any;
    PUBLIC_DOCUMENTS: any;
    PUBLIC_DOWNLOADS: any;
    requestFileSystem: (
        type: number,
        succesCB?: (file: IFileSystem) => any,
        errorCB?: Function,
    ) => any;
    resolveLocalFileSystemURL: (
        url: string,
        succesCB?: (entrt: IDirectoryEntry) => any,
        errorCB?: Function,
    ) => any;
    convertLocalFileSystemURL: (url: string) => string;
    convertAbsoluteFileSystem: (path: string) => string;
}

interface IDirectoryEntry {
    isFile: boolean;
    isDirectory: boolean;
    name: boolean;
    fullPath: string;
    fileSystem: IFileSystem;
    getMetadata: () => any;
    moveTo: (
        parent: IDirectoryEntry,
        newName?: string,
        succesCB?: (entry: IDirectoryEntry) => any,
        errorCB?: Function,
    ) => any;
    copyTo: (
        parent: IDirectoryEntry,
        newName?: string,
        succesCB?: (entry: IDirectoryEntry) => any,
        errorCB?: Function,
    ) => any;
    toURL: () => string;
    toLocalURL: () => string;
    toRemoteURL: () => string;
    remove: (
        succesCB?: (entry: IDirectoryEntry) => any,
        errorCB?: Function,
    ) => any;
}

interface IFileSystem {
    name?: string;
    root?: string;
}

interface IMessaging {
    TYPE_SMS: any;
    TYPE_MMS: any;
    TYPE_EMAIL: any;
    createMessage: (type: number) => IMessage;
    sendMessage: (msg: IMessage, successCB?: Function, errorCB?: Function) => any;
}

interface IMessage {
    to?: Array<string>;
    cc?: Array<string>;
    bcc?: Array<string>;
    from?: string;
    subject?: string;
    body?: string;
    bodyType?: any;
}

interface IOauth {
    getServices?: (
        successCB?: (auths: Array<IAuthService>) => any,
        errorCB?: Function,
    ) => any;
}

interface IAuthService {
    id?: string;
    description?: string;
    authResult?: string;
    userInfo?: string;
    extra?: any;
    login?: Function;
    logout?: Function;
    getUserInfo?: Function;
    addPhoneNumber?: Function;
}

interface IOrientation {
    getCurrentOrientation: (successCB?: Function, errorCB?: Function) => any;
    watchOrientation: (
        successCB?: Function,
        errorCB?: Function,
        option?: IOrientationOption,
    ) => number;
    clearWatch: (watchId: number) => any;
}

interface IOrientationOption {
    alpha?: number;
    beta?: number;
    gamma?: number;
    magneticHeading?: number;
    trueHeading?: number;
    headingAccuracy?: number;
}

interface IPayment {
    getChannels?: (
        successCB: (channels: Array<IPaymentChannel>) => any,
        errorCB?: Function,
    ) => any;
    request?: (
        channel?: IPaymentChannel,
        statement?: OrderStatementIAP | any,
        successCB?: (result: IPaymentResult | IAPTransaction) => any,
        errorCB?: Function,
    ) => any;
}

interface IPaymentChannel {
    id?: string;
    description?: string;
    serviceReady?: boolean;

    installService?: () => void;

    // iOS iAP
    requestOrder?: (
        ids: Array<string>,
        successCB?: (res: Array<any>) => void,
        errorCB?: Function,
    ) => void;
    restoreComplateRequest?: (options: object, successCB: Function) => void;
}

interface IAPProductInfo {
    productIdentifier?: string;
    quantity?: string;
}

interface IPaymentResult {
    channel?: IPaymentChannel;
    tradeno?: string;
    description?: string;
    url?: string;
    signature?: string;
    rawdata?: string;
}

interface IAPTransaction {
    payment?: string;
    transactionDate?: string;
    transactionIdentifier?: string;
    transactionReceipt?: string;
    transactionState?: '1' | '2' | '3';
}

interface OrderStatementIAP {
    productid?: string;
    username?: string;
    quantity?: string;
}

interface IProximity {
    getCurrentProximity: (successCB: Function, errorCB?: Function) => any;
    watchProximity: (changeCB: Function, errorCB?: Function) => number;
    clearWatch: (watchId: number) => any;
}

interface IPush {
    addEventListener(
        type: 'click' | 'receive',
        listener: Function,
        capture?: boolean,
    );

    clear();

    createMessage(content: string, payload?: string, options?: IMessageOptions);

    getAllMessage(): Array<IPushMessage>;

    getClientInfo(): IClientInfo;

    setAutoNotification(notify: boolean);

    remove(message?: IPushMessage);
}

interface IClientInfo {
    token?: string;
    clientid?: string;
    appid?: string;
    appkey?: string;
}

interface IPushMessage {
    title?: string;
    content?: string;
    payload?: string;
    aps?: any;
}

interface IMessageOptions {
    appid?: string;
    cover?: boolean;
    delay?: number;
    icon?: string;
    sound?: string;
    title?: string;
    when?: string;
}

interface IShare {
    getServices(successCB: Function, errorCB?: Function);

    sendWithSystem(msg: IShareMessage, successCB?: Function, errorCB?: Function);
}

interface IShareMessage {
    // 微信分享平台，可取值： "web"-分享网页类型，title（必填）、content（必填）、thumbs（必填）、href（网页url，必填）属性值有效； "text"-分享文字类型，content（必填）属性值有效； "image"-分享图片类型，pictures（必填）属性值有效； "music"-分享音乐类型，title（必填）、content（必填）、thumbs（必填）、media（音乐url，必填）属性值有效； "video"-分享视频类型，title（必填）、content（必填）、thumbs（必填）、media（视频url，必填）属性值有效； "miniProgram"-分享小程序类型（仅支持分享到好友），title（必填）、content（必填）、thumbs（图片小于128K，宽高比为5:4，必填）、miniProgram（小程序参数，必填）属性值有效； 没有设置type时，如果href值有效则默认值为"web"，如果pictures有效则默认值为"image"，否则默认值为"text"。 新浪微博分享平台，可取值： "web"-分享网页类型，content、href（网页url，必填），分享链接添加到内容之后； "text"-分享文字类型，content（必填）属性有效，可在内容中直接插入链接地址； "image"-分享图片类型，content（可选）、thumbs（可选）、pictures（必填）属性有效； "video"-分享视频类型，content（可选）、thumbs（可选）、media（本地视频文件，必填）属性有效； 没有设置type时，如果存在thumbs则默认值为"image"，如果存在href则默认值为"web"，否则默认为"text"。 QQ分享平台，可取值： "text"-分享文字类型，href（iOS可选，Android必填）、title（必填，最长30个字符）、content（可选，最长40个字符）、pictures或thumbs（可选，优先pictures，iOS不支持）属性有效； "image"-分享图片类型，pictures或thumbs（必填，优先pictures）属性有效； "music"-分享音乐类型，title（必填，最长30个字符）、content（可选，最长40个字符）、href（必填）、media（音乐url，必填）、pictures或thumbs（可选，优先pictures）属性值有效； 没有设置type时，默认值"text"。
    type?: string;
    content?: string;
    thumbs?: Array<string>;
    pictures: Array<string>;
    media?: string;
    href?: string;
    title?: string;
    extra?: any;
    geo?: any;
    miniProgram?: string;
    interface?: string;
}

interface ISpeech {
    startRecognize(
        options?: ISpeechRecognizeOption,
        successCB?: (res: Array<string>) => any,
        errorCB?: Function,
    );

    stopRecognize();
}

interface ISpeechRecognizeOption {
    engine?: string;
    service?: string;
    timeout?: number;
    lang?: string;
    punctuation?: string;
    continue?: boolean;
    nbest?: number;
    userInterface?: boolean;

    onstart(cb?: Function);

    onend(cb?: Function);

    onaudiostart(cb?: Function);

    onaudioend(cb?: Function);

    onrecognizestart(cb?: Function);

    onrecognizeend(cb?: Function);
}

interface IStatistic {
    eventTrig(id: string, value?: any);

    eventDuration(id: string, duration: number, value?: string);
}

interface IStorage {
    getLength(): number;

    getItem(key: string): string;

    setItem(key: string, value: string);

    removeItem(key: string);

    clear();

    key(index: number);
}

interface IUploader {
    createUpload(
        url: string,
        options?: IUploadOptions,
        completedCB?: (upload: IUpload, status: number) => any,
    );

    enumerate(enumCB: (upload: IUpload, status: number) => any, state: number);

    clear(state: undefined | 0 | 1 | 2 | 3 | 4 | 5 | -1);

    startAll();
}

interface IUpload {
    url?: string;
    state?: number;
    options?: IUploadOptions;
    responseText?: string;
    uploadedSize?: number;
    totalSize?: number;

    abort();

    addData(key?: string, value?: string): boolean;

    addEventListener(event?: string, listener?: Function, capture?: boolean);

    addFile(path?: string, options?: IUploadOptions): boolean;

    getAllResponseHeaders(): string;

    getResponseHeader(headerName: string): string;

    pause();

    resume();

    setRequestHeader(headerName: string, headerValue?: string);

    start();
}

interface IUploadOptions {
    method?: 'POST';
    blocksize?: number;
    priority?: number;
    timeout?: number;
    retry?: number;
    retryInterval?: number;
}

interface IMaps {
    openSysMap(dst: any, des: string, src: any);

    Point(lng: number, lat: number): void;

    Map(id, options): void;
}

interface INativeObj {
    AnimationOptions(type: string, duration: number): void;

    AnimationViewStyles(bitmap: any): void;

    Bitmap(id, path): Bitmap;

    ImageSlider(id, styles?: ImageSliderStyles, tags?: Array<any>): void;

    Rect?: any;
    TextStyles?: any;
    View?: View;
}

declare class View {
    id: string;

    static startAnimation(options, view, otherview, callback);

    static clearAnimation(type);

    static getViewById(id): View;

    addEventListener(event, listener, capture);

    animate(options, callback);

    close();

    clearRect(position, id);

    draw(tags);

    drawBitmap(src, sprite, position, id);

    drawRect(color, position, id);

    drawText(text, position, styles, id);

    drawRichText(text, position, styles, id);

    drawInput(position, styles, id);

    etInputFocusById(id): boolean;

    getInputValueById(id): string;

    reset();

    restore();

    show();

    setInputFocusById(id, focusable);

    setStyle(styles);

    setTouchEventRect(rect);

    hide();

    interceptTouchEvent(intercept);

    isVisible(): string;
}

declare class Bitmap {
    static getItems(): Array<Bitmap>;

    static getBitmapById(id: any): Bitmap;

    clear();

    load(path, successCallback, errorCallback);

    loadBase64Data(data, successCallback, errorCallback);

    save(path, options, successCallback, errorCallback);

    toBase64Data(): string;
}

interface ImageSliderStyles {
    autoplay?: boolean;
    images?: Array<any>;
    loop?: boolean;
    fullscreen?: boolean;
    interval?: number;
}

interface IVideo {
    createVideoPlayer(id: string, styles: IVideoPlayerStyles);

    reateLivePusher(id: string, styles: ILivePusherStyles);

    getVideoPlayerById(id: string): IVideoPlayer;

    getLivePusherById(id);

    VideoPlayer: IVideoPlayer;
    LivePusher: ILivePusher;
}

interface IVideoPlayer {
    constructor(id, styles);

    addEventListener(event, listener, capture);

    setStyles(styles);

    play();

    pause();

    seek(position);

    requestFullScreen();

    exitFullScreen();

    stop();

    close();

    sendDanmu(danmu);

    playbackRate(rate);
}

interface ILivePusher {
    constructor(id, options);

    addEventListener(event, listener, capture);

    setStyles(styles);

    start();

    stop();

    pause();

    resume();

    switchCamera();

    snapshot();

    close();
}

interface IVideoPlayerStyles extends IPopPosition {
    src: string;
    'initial-time'?: number;
    controls?: boolean;
    'danmu-list'?: Array<any>;
    'danmu-btn'?: Array<any>;
    'enable-danmu'?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    direction?: 0 | 90 | -90;
    'show-progress'?: boolean;
    'show-fullscreen-btn'?: boolean;
    'show-play-btn'?: boolean;
    'enable-progress-gesture'?: boolean;
    poster?: string;
}

interface ILivePusherStyles extends IPopPosition {
    url: string;
    muted?: boolean;
    'enable-camera'?: boolean;
    'auto-focus'?: boolean;
    beauty?: 0 | 1;
    whiteness?: 0 | 1 | 2 | 3 | 4 | 5;
}

interface IWebview {
    all(): WebviewObject;

    close(
        id_wvobj: string | WebviewObject,
        aniClose?: any,
        duration?: number,
        extras?: any,
    );

    create(url: string, id?: string, styles?: IWebviewStyles, extras?);

    currentWebview(): WebviewObject; // 获取当前窗口的WebviewObject对象
    getDisplayWebview(): Array<WebviewObject>; // 获取屏幕所有可视的Webview窗口
    getWebviewById(id: string): WebviewObject; // 查找指定标识的WebviewObject窗口
    getLaunchWebview(): WebviewObject; // 获取应用首页WebviewObject窗口对象
    getSecondWebview(): WebviewObject; // 获取应用第二个首页WebviewObject窗口对象
    getTopWebview(): WebviewObject; // 获取应用显示栈顶的WebviewObject窗口对象
    hide(
        id_wvobj: string | WebviewObject,
        aniClose?: any,
        duration?: number,
        extras?: any,
    ); // 隐藏Webview窗口
    open(
        url: string,
        id?: string,
        styles?: IWebviewStyles,
        aniShow?: any,
        duration?: number,
        showedCB?: Function,
    ): WebviewObject; // 创建并打开Webview窗口
    prefetchURL(url): void; // 预载网络页面
    prefetchURLs(urls: Array<string>): void; // 预载网络页面（多个地址）
    show(
        id_wvobj: string | WebviewObject,
        aniShow?: any,
        duration?: number,
        showedCB?: Function,
        extras?: any,
    ): WebviewObject; // 显示Webview窗口
    startAnimation(
        options: WebviewAnimationOptions,
        otherOptions?: WebviewAnimationOptions,
        callback?: Function,
    ); // Webview窗口组合动画
    defaultHardwareAccelerated(): boolean; // 获取Webview默认是否开启硬件加速
}

interface WebviewAnimationOptions {
    view: WebviewObject;
    styles: WebviewAnimationStyles;
    action: string;
}

interface WebviewAnimationStyles {
    fromLeft: string;
    toLeft: string;
}

interface IWebviewStyles {
    animationOptimization?: 'auto' | 'none';
    cachemode?: 'default' | 'cacheElseNetwork' | 'cacheOnly';
    backButtonAutoControl?:
        | 'hide'
        | 'slide-in-right'
        | 'slid-out-right'
        | 'close'
        | 'none';
    background?: string;
    blockNetworkImage?: boolean;
    bounce?: 'none' | 'vertical' | 'horizontal' | 'all';
    bounceBackground?: string;
    decelerationRate?: number;
    dock?: 'top' | 'bottom' | 'right' | 'left';
    errorPage?: string;
    replacewebapi?: WebviewReplaceWebApiOptions;
    hardwareAccelerated?: boolean;
    kernel?: 'WKWebview' | 'UIWebview';
    margin?: string;
    mask?: string;
    opacity?: number;
    plusrequire?: 'ahead' | 'normal' | 'later' | 'none';
    render?: string;
    scalable?: boolean;
    scrollIndicator?: 'all' | 'vertical' | 'horizontal' | 'none';
    scrollsToTop?: boolean;
    shareable?: boolean;
    softinputMode?: string;
    statusbar?: WebviewStatusbarStyles;
    subNViews?: Array<any>;
    titleNView?: any;
    transition?: WebviewTransition;
    transform?: any;
    position?: 'static' | 'absolute' | 'dock';
    userSelect?: boolean;
    videoFullscreen?:
        | 'auto'
        | 'portrait-primary'
        | 'portrait-secondary'
        | 'landscape-primary'
        | 'landscape-secondary';
    zindex?: number;
    top?: string;
    left?: string;
    width?: string;
    height?: string;
}

interface WebviewTransition {
    property?: 'all';
    duration?: any;
    timingfunction?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

interface WebviewStatusbarStyles {
    background: string;
}

interface WebviewReplaceWebApiOptions {
    geolocation: 'auto' | 'none';
}

interface WebviewObject {
    id?: any;

    addEventListener(event, listener, capture);

    append(webview: WebviewObject);

    appendJsFile(file: string);

    animate(options?: WebviewAnimationOptions, callback?: Function);

    back();

    beginPullToRefresh();

    canBack(queryCallback: ({canBack, canForward}) => any);

    canForward(queryCallback: ({canBack, canForward}) => any);

    checkRenderedContent(
        options?: WebviewRenderedEventOptions,
        successCallback?: Function,
        errorCallback?: Function,
    );

    children(): Array<WebviewObject>;

    clear();

    close(
        aniClose:
            | 'auto'
            | 'none'
            | 'slide-out-right'
            | 'slide-out-left'
            | 'slide-out-top'
            | 'slide-out-bottom'
            | 'fade-out'
            | 'zoom-in'
            | 'zoom-fade-in'
            | 'pop-out',
        duration?: number,
        extras?: any,
    );

    drag(
        options?: WebviewDragOptions,
        otherView?: WebviewDragOtherViewOptions,
        callback?: Function,
    );

    draw(
        bitmap?: Bitmap,
        successCallback?: Function,
        errorCallback?: Function,
        options?: WebviewDragOptions,
    );

    endPullToRefresh();

    evalJS(js: string);

    forward();

    getFavoriteOptions(): WebviewFavoriteOptions;

    getShareOptions(): WebviewFavoriteOptions;

    getStyle(): any;

    getSubNViews(): Array<any>;

    getTitle(): string;

    getTitleNView(): any;

    getURL(): string;

    hide(
        aniHide:
            | 'auto'
            | 'none'
            | 'slide-out-right'
            | 'slide-out-left'
            | 'slide-out-top'
            | 'slide-out-bottom'
            | 'fade-out'
            | 'zoom-in'
            | 'zoom-fade-in'
            | 'pop-out',
        duration?: number,
        extras?: any,
    );

    interceptTouchEvent(intercept: boolean);

    isHardwareAccelerated(): boolean;

    isVisible(): boolean;

    listenResourceLoading(options?: any, callback?: Function);

    loadData(data?: string, options?: WebviewLoadDataOptions);

    loadURL(url?: string, additionalHttpHeaders?: any);

    nativeInstanceObject(): any;

    opened(): Array<WebviewObject>;

    opener(): WebviewObject;

    overrideResourceRequest(options?: any);

    overrideUrlLoading(options, callback);
}

interface WebviewOverrideUrlOptions {
    effect?: 'instant' | 'touchstart';
    mode?: 'allow' | 'reject';
    match?: string;
    exclude?: string;
}

interface WebviewLoadDataOptions {
    baseURL?: string;
    mimeType?: string;
    encoding?: string;
}

interface WebviewFavoriteOptions {
    icon?: string;
    title?: string;
    href?: string;
}

interface WebviewDragOptions {
    callbackStep?: number;
    direction?: 'rtl' | 'left' | 'ltr' | 'right';
    moveMode?: 'followFinger' | 'silent' | 'bounce';
}

interface WebviewDragOtherViewOptions {
    view: string;
    moveMode: 'follow' | 'silent';
}

interface WebviewAnimationOptions {
    type?: string;
    duration?: number;
    frames?: number;
    gion?: any;
}

interface WebviewRenderedEventOptions {
    type?: 'auto' | 'top' | 'center' | 'bottom';
    interval?: number;
}

interface INet {
    XMLHttpRequest?(): IXMLHttpRequest;

    ProgressEvent?: IProgressEvent;
}

interface IProgressEvent {
    target?: IXMLHttpRequest;
    lengthComputable?: number;
    loaded?: IXMLHttpRequest;
    total?: IXMLHttpRequest;
}

declare class IXMLHttpRequest {
    readyState?: number;
    readonly response?: string;
    responseText?: string;
    responseType?: string;
    responseXML?: string;
    status?: number;
    statusText?: string;
    timeout?: number;
    withCredentials?: boolean;

    abort?();

    getAllResponseHeaders?(): string;

    getResponseHeader?(headername?: string): string;

    open?(
        method: string,
        url: string,
        username?: string,
        password?: string,
    ): string;

    overrideMimeType?(mime: string);

    send(body: string);

    setRequestHeader(headerName?: string, headerValue?: string);

    onreadystatechange: Function;
    onloadstart: Function;
    onprogress: Function;
    onabort: Function;
    onerror: Function;
    onload: Function;
    ontimeout: Function;
    onloadend: Function;
}

interface IZip {
    compress(
        src?: string,
        zipfile?: string,
        successCB?: Function,
        errorCB?: Function,
    );

    decompress(
        zipfile?: string,
        target?: string,
        successCB?: Function,
        errorCB?: Function,
    );

    compressImage(
        options?: CompressImageOptions,
        successCB?: Function,
        errorCB?: Function,
    );
}

interface CompressImageOptions {
    src?: string;
    dst?: string;
    overwrite?: boolean;
    format?: string;
    quality?: number;
    width?: string;
    height?: string;
    rotate?: number;
    clip: ClipImageOptions;
}

interface ClipImageOptions {
    top?: string;
    left?: string;
    width?: string;
    height?: string;
}

declare namespace plus {
    export const accelerometer: IAccelerometer;
    export const audio: IAudio;
    export const barcode: IBarcode;
    export const camera: ICamera;
    export const contacts: IContacts;
    export const device: IDevice;
    export const downloader: IDownloader;
    export const events_preview: Preview_IEvents;
    export const fingerprint: IFingerprint;
    export const gallery: IGallery;
    export const geolocation: IGeolocation;
    export const io: IIO;
    export const key: IKey;
    export const maps: IMaps;
    export const messaging: IMessaging;
    export const nativeObj: INativeObj;
    export const nativeUI: INativeUI;
    export const navigator: INavigator;
    export const oauth: IOauth;
    export const orientation: IOrientation;
    export const payment: IPayment;
    export const proximity: IProximity;
    export const push: IPush;
    export const runtime: IRuntime;
    export const share: IShare;
    export const speech: ISpeech;
    export const statistic: IStatistic;
    export const storage: IStorage;
    export const uploader: IUploader;
    export const video: IVideo;
    export const webview: IWebview;
    export const net: INet;
    export const zip: IZip;
}
