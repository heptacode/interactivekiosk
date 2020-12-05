"use strict";

import { app, protocol, BrowserWindow, systemPreferences } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		center: true,
		autoHideMenuBar: true,
		frame: false,
		titleBarStyle: "hidden",
		webPreferences: {
			webSecurity: false,
			nodeIntegration: true,
		},
	});

	win.once("ready-to-show", () => {
		win.show();
		askForMediaAccess();
	});
	win.once("close", () => {
		app.exit();
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol("app");
		// Load the index.html when not in development
		win.loadURL("app://./index.html");
	}
}

async function askForMediaAccess(): Promise<boolean> {
	try {
		if (process.platform !== "darwin") return true;

		const status = await systemPreferences.getMediaAccessStatus("microphone");
		console.info("Current microphone access status:", status);

		if (status === "not-determined") {
			const success = await systemPreferences.askForMediaAccess("microphone");
			console.info("Result of microphone access:", success.valueOf() ? "granted" : "denied");
			return success.valueOf();
		}

		return status === "granted";
	} catch (error) {
		console.error("Could not get microphone permission:", error.message);
	}
	return false;
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS_DEVTOOLS);
		} catch (e) {
			console.error("Vue Devtools failed to install:", e.toString());
		}
	}
	createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit();
			}
		});
	} else {
		process.on("SIGTERM", () => {
			app.quit();
		});
	}
}
