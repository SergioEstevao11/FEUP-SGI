import { CGFapplication, CGFinterface } from '../lib/CGF.js';
import { MyScene } from './MyScene.js';

function main()
{
    var app = new CGFapplication(document.body);
    var myScene = new MyScene();
    var myInterface = new CGFinterface();

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

    app.run();
}

main();