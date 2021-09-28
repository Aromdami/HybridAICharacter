var unitySetup = {
    dataUrl: "Build/Downloads.data",
    frameworkUrl: "Build/Downloads.framework.js",
    codeUrl: "Build/Downloads.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "New_3d_bot",
    productVersion: "0.1",
    // matchWebGLToCanvasSize: false, // Uncomment this to separately control WebGL canvas render size and DOM element size.
    // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
  };
var buildURL = "../Build";
var loaderURL = buildURL + "/Downloads.loader.js";
var unityContainer = document.querySelector("#character");
var canvas = document.querySelector("#unity-canvas");

var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");

var mainScript = document.createElement("script");

var charInstance = null;

mainScript.src = loaderURL;
mainScript.onload = () => {
    createUnityInstance
    (
        canvas, 
        unitySetup, 
        (progress) =>{progressBarFull.style.width = 100 * progress + "%";}
    ).then((unityInstance) =>{ 
        charInstance = unityInstance;
        loadingBar.style.display = "none";
        }
    ).catch((message) => {alert(message);});
}

document.body.appendChild(mainScript);

createUnityInstance(document.querySelector("#unity-canvas"), unitySetup);

function stopTalk()
{
    charInstance.SendMessage("CCavatar", "changeAnimation", 1);
}
function startTalk()
{
    charInstance.SendMessage("CCavatar", "changeAnimation", 0);
}
function untPause()
{
    charInstance.SendMessage("CCavatar", 0);
}