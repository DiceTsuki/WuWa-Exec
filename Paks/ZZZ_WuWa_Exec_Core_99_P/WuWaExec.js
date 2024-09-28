"use strict";
const puerts_1 = require("puerts"),
	UE = require("ue"),
	gameInstance = puerts_1.argv.getByName("GameInstance"),
	binDir = UE.KismetSystemLibrary.GetProjectDirectory() + "Binaries/",
	savedDir = UE.KismetSystemLibrary.GetProjectSavedDirectory(),
	blackTxt = binDir + "wuwa_exec_engineini_blacklist.txt",
	whiteTxt = binDir + "wuwa_exec_engineini_whitelist.txt",
	engineIni = savedDir + "Config/WindowsNoEditor/Engine.ini";
function ExecCVarFile(txtName) {
	const cVarFile = binDir + txtName;
	if (UE.BlueprintPathsLibrary.FileExists(cVarFile)) {
		UE.KismetSystemLibrary.ExecuteConsoleCommand(
			gameInstance,
			"exec " + txtName,
		);
	}
}
function ExecEngineIni() {
	var execMode, listTxt;
	UE.BlueprintPathsLibrary.FileExists(blackTxt)
		? ((execMode = "blacklist"), (listTxt = blackTxt))
		: UE.BlueprintPathsLibrary.FileExists(whiteTxt)
			? ((execMode = "whitelist"), (listTxt = whiteTxt))
			: (execMode = "");
	if (execMode !== "") {
		if (UE.BlueprintPathsLibrary.FileExists(engineIni)) {
			var iniData = (0, puerts_1.$ref)("");
			if (UE.KuroStaticLibrary.LoadFileToString(iniData, engineIni)) {
				iniData = (0, puerts_1.$unref)(iniData).split(new RegExp(/\n|\r\n/));
				var sectionList = (0, puerts_1.$ref)("");
				if (UE.KuroStaticLibrary.LoadFileToString(sectionList, listTxt)) {
					sectionList = (0, puerts_1.$unref)(sectionList).split(
						new RegExp(/\n|\r\n/),
					);
					var currSection = "";
					for (var lineData of iniData) {
						if (lineData[0] === "[") {
							currSection = lineData;
						}
						if (
							currSection !== "" &&
							lineData !== "" &&
							lineData !== currSection
						) {
							var sectionMatched = false;
							for (const section of sectionList) {
								if (section !== "" && section === currSection) {
									sectionMatched = true;
									break;
								}
							}
							const continueExec =
								(!sectionMatched && execMode === "blacklist") ||
								(sectionMatched && execMode === "whitelist");
							if (continueExec) {
								var coCmd = lineData;
								lineData = lineData.split("=");
								if (lineData.length === 2) {
									coCmd = lineData[0] + " " + lineData[1];
								}
								UE.KismetSystemLibrary.ExecuteConsoleCommand(
									gameInstance,
									coCmd,
								);
							}
						}
					}
				}
			}
		}
	}
}
exports.ExecCVarFile = ExecCVarFile;
exports.ExecEngineIni = ExecEngineIni;
