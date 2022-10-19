import { BrowserWindow, BrowserWindowConstructorOptions, LoadURLOptions } from 'electron';
import {ChildProcess} from 'child_process';
import * as path from 'node:path';
import { app, dialog } from 'electron';
import { exec } from 'node:child_process';
import * as net from 'net';
// @ts-ignore
import * as ElectronConfig from 'electron-config';
import {AddressInfo} from "net";
import App = Electron.App;

const APP_PATH = path.join(__dirname, '../dist/phonologic-viewer')
const API_HOST = "127.0.0.1";

class Main {
  application: Electron.App;
  mainWindow: AppWindow;
  server: BackendServer;

  constructor(application: App, server: BackendServer) {
    this.application = application;
    this.server = server;
    this.mainWindow = new AppWindow();
    this.application.on('will-quit', this.willQuit);
    this.application.on('window-all-closed', this.windowAllClosed);
  }

  private willQuit = () => {
    this.server.stop()
  }

  private windowAllClosed = () => {
    this.application.quit();
  }

  async run() {
    try {
      await this.server.start();
      this.mainWindow.loadURL(this.server.url);
    }
    catch (err: any) {
      dialog.showErrorBox(err.name, err.message);
      this.application.quit();
    }
  }
}

class AppConfig {
  private config: any = new ElectronConfig({});

  get windowOptions(): AppWindowOptions {
    return this.config.get("windowOptions", {});
  }

  applyWindowOptions(window: BrowserWindow) {
    this.config.set("windowOptions", {
      ...window.getBounds(),
      isMaximized: window.isMaximized()
    } as AppWindowOptions);
  }
}

interface AppWindowOptions extends BrowserWindowConstructorOptions{
  isMaximized: boolean;
}

class AppWindow {
  window: BrowserWindow;
  appConfig: AppConfig = new AppConfig();

  constructor() {
    this.window = AppWindow.buildWindow(this.appConfig.windowOptions);
    this.window.on("close", this.onClose);
  }

  private static buildWindow(windowOptions: AppWindowOptions) {
    let window = new BrowserWindow({
      // position etc
      ...windowOptions,
      // merged with behavior settings
      ...{
        minWidth: 900,
        minHeight: 500,
      }
    } as BrowserWindowConstructorOptions);
    if (windowOptions.isMaximized) {
      window.maximize();
    }
    return window
  }

  loadURL = (url: string, options?: LoadURLOptions): Promise<void> => {
    return this.window.loadURL(url, options);
  }

  onClose = () => {
    this.appConfig.applyWindowOptions(this.window);
  }
}

class BackendServer {
  readonly host: string;
  readonly port: number;
  readonly url: string;
  private innerProcess: ChildProcess|null = null;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
    this.url = `http://${this.host}:${this.port}`;
  }

  start(): Promise<void> {
    let command = `${APP_PATH} --host ${this.host} --port ${this.port}`;
    let serverProcess = exec(command, (err, stdout, stderr) => {
      if (err && err.code) {
        throw {
          name: `Error starting service (code ${err.code})`,
          message: stderr
        };
      }
    });
    // @ts-ignore
    serverProcess.stdout.on('data', (data) => this.writeServerOutput(data, "[API STDOUT]"));
    // @ts-ignore
    serverProcess.stderr.on('data', (data) => this.writeServerOutput(data, "[API STDERR]"));

    try {
      return this.processPromise(serverProcess);
    }
    catch (e){
      throw e;
    }
  }

  stop() {
    if (this.innerProcess && !this.innerProcess.killed) {
      this.innerProcess.kill();
    }
    else {
      throw new Error("Can't stop a server that isn't running!")
    }
  }

  private processPromise(serverProcess: ChildProcess): Promise<void> {
    let match: string = "";
    return new Promise((resolve) => {
        // @ts-ignore
        serverProcess.stderr.on('data', (data) => {
          if (!match) {
            match = data.match(/(https?.*?):(\d+)/);
            if (match) {
              resolve();
            }
          }
        });
    });
  }

  private writeServerOutput(data: string, linePrefix: string) {
    data.trim().split("\n").forEach((line) => {
      console.log(`${linePrefix}: ${line}`);
    });
  }

  static async findAvailablePort() {
    const server = net.createServer((c) => {
      c.write('Hello world\n');
      c.pipe(c);
    });
    await server.listen(0, () => {});
    let foundPort = (server.address() as AddressInfo).port;
    server.close();
    console.log(`Found open port: ${foundPort}`);
    return foundPort;
  }
}


Promise.all([
  app.whenReady(),
  BackendServer.findAvailablePort(),
]).then(async ([whenReadyResult, port]) => {
  let server = new BackendServer(API_HOST, port);
  const main = new Main(app, server);
  await main.run();
});
