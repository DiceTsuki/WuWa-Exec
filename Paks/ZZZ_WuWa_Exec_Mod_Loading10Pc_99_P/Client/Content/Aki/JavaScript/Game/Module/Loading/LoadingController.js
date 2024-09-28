"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
	(exports.LoadingController = void 0);
const UE = require("ue"),
	WuWaExec = require("WuWaExec"),
	Log_1 = require("../../../Core/Common/Log"),
	Net_1 = require("../../../Core/Net/Net"),
	MathCommon_1 = require("../../../Core/Utils/Math/MathCommon"),
	EventDefine_1 = require("../../Common/Event/EventDefine"),
	EventSystem_1 = require("../../Common/Event/EventSystem"),
	GlobalData_1 = require("../../GlobalData"),
	ModelManager_1 = require("../../Manager/ModelManager"),
	CharacterBuffIds_1 = require("../../NewWorld/Character/Common/Component/Abilities/CharacterBuffIds"),
	UiControllerBase_1 = require("../../Ui/Base/UiControllerBase"),
	UiManager_1 = require("../../Ui/UiManager"),
	GameModeController_1 = require("../../World/Controller/GameModeController"),
	BlackScreenController_1 = require("../BlackScreen/BlackScreenController"),
	UiLoginSceneManager_1 = require("../UiComponent/UiLoginSceneManager"),
	NormalLoadingViewGlobalData_1 = require("./Data/NormalLoadingViewGlobalData");
class LoadingController extends UiControllerBase_1.UiControllerBase {
	static OnInit() {
		return (
			(ModelManager_1.ModelManager.LoadingModel.Speed =
				GameModeController_1.BASE_SPEED),
			!0
		);
	}
	static OnClear() {
		return (
			UE.NavigationSystemV1.SetGameLoadingFlag(
				GlobalData_1.GlobalData.GameInstance,
				!1,
			),
			!0
		);
	}
	static OnRegisterNetEvent() {
		Net_1.Net.Register(113, LoadingController.Svi);
	}
	static OnUnRegisterNetEvent() {
		Net_1.Net.UnRegister(113);
	}
	static OnAddEvents() {
		EventSystem_1.EventSystem.Add(
			EventDefine_1.EEventName.BeforeLoadMap,
			LoadingController.SYi,
		),
			EventSystem_1.EventSystem.Add(
				EventDefine_1.EEventName.WorldDoneAndCloseLoading,
				LoadingController.FWe,
			),
			EventSystem_1.EventSystem.Add(
				EventDefine_1.EEventName.WorldDone,
				LoadingController.nye,
			),
			EventSystem_1.EventSystem.Add(
				EventDefine_1.EEventName.OnUpdateSceneTeam,
				LoadingController.yvi,
			),
			EventSystem_1.EventSystem.Add(
				EventDefine_1.EEventName.TeleportStart,
				LoadingController.bpr,
			),
			EventSystem_1.EventSystem.Add(
				EventDefine_1.EEventName.TeleportComplete,
				LoadingController.Ilt,
			);
	}
	static OnRemoveEvents() {
		EventSystem_1.EventSystem.Remove(
			EventDefine_1.EEventName.BeforeLoadMap,
			LoadingController.SYi,
		),
			EventSystem_1.EventSystem.Remove(
				EventDefine_1.EEventName.WorldDoneAndCloseLoading,
				LoadingController.FWe,
			),
			EventSystem_1.EventSystem.Remove(
				EventDefine_1.EEventName.WorldDone,
				LoadingController.nye,
			),
			EventSystem_1.EventSystem.Remove(
				EventDefine_1.EEventName.OnUpdateSceneTeam,
				LoadingController.yvi,
			),
			EventSystem_1.EventSystem.Remove(
				EventDefine_1.EEventName.TeleportStart,
				LoadingController.bpr,
			),
			EventSystem_1.EventSystem.Remove(
				EventDefine_1.EEventName.TeleportComplete,
				LoadingController.Ilt,
			);
	}
	static Eea() {
		UE.NavigationSystemV1.SetGameLoadingFlag(
			GlobalData_1.GlobalData.GameInstance,
			!0,
		);
	}
	static yea() {
		UE.NavigationSystemV1.SetGameLoadingFlag(
			GlobalData_1.GlobalData.GameInstance,
			!1,
		);
	}
	static UpdateUidViewShow() {
		var e = ModelManager_1.ModelManager.LoadingModel.IsShowUidView;
		UiManager_1.UiManager.IsViewOpen("UidView") !== e &&
			(e
				? UiManager_1.UiManager.OpenView("UidView")
				: UiManager_1.UiManager.CloseView("UidView"));
	}
	static async Ivi() {
		var e,
			o,
			a = ModelManager_1.ModelManager.SceneTeamModel.GetTeamEntities();
		for (const n of a)
			n.Valid &&
				(e = n.Entity.GetComponent(160)) &&
				e.AddBuff(CharacterBuffIds_1.buffId.Invisible, {
					InstigatorId: e.CreatureDataId,
					Reason: "HandleRoleBuffChangeInLoading",
				});
		await NormalLoadingViewGlobalData_1.NormalLoadingViewGlobalData
			.FinishPromise?.Promise;
		for (const r of a)
			r.Valid &&
				(o = r.Entity.GetComponent(160)) &&
				o.RemoveBuff(
					CharacterBuffIds_1.buffId.Invisible,
					-1,
					"HandleRoleBuffChangeInLoading",
				);
	}
	static async GameModeOpenLoading(e) {
		var o;
		NormalLoadingViewGlobalData_1.NormalLoadingViewGlobalData
			.FirstProgressPromise
			? Log_1.Log.CheckInfo() &&
				Log_1.Log.Info("Loading", 9, "Loading界面正在打开中")
			: ((o = ModelManager_1.ModelManager.LoadingModel.GetIsLoginToWorld()) &&
					UiLoginSceneManager_1.UiLoginSceneManager.Destroy(),
				Log_1.Log.CheckDebug() &&
					Log_1.Log.Debug("Loading", 9, "打开Loading界面", [
						"从登录界面进入大世界",
						o,
					]),
				LoadingController.OpenLoadingView(void 0, e)),
			await NormalLoadingViewGlobalData_1.NormalLoadingViewGlobalData
				.FirstProgressPromise.Promise,
			BlackScreenController_1.BlackScreenController.RemoveBlackScreen(
				"None",
				"LeaveScene",
			);
	}
	static async GameModeCloseLoading() {
		Log_1.Log.CheckDebug() && Log_1.Log.Debug("Loading", 9, "关闭Loading界面"),
			await LoadingController.CloseLoadingView(),
			ModelManager_1.ModelManager.LoginModel.CleanCreateData();
	}
	static OpenLoadingView(o, a) {
		NormalLoadingViewGlobalData_1.NormalLoadingViewGlobalData.CreateFirstProgressPromise(),
			NormalLoadingViewGlobalData_1.NormalLoadingViewGlobalData.CreateFinishPromisePromise(),
			LoadingController.SetProgress(
				GameModeController_1.OPENLOADING_END_PROGRESS,
				void 0,
				1,
				!0,
				!1,
			),
			ModelManager_1.ModelManager.LoadingModel.SetIsLoading(!0),
			UiManager_1.UiManager.OpenView("LoadingView", void 0, (e) => {
				o?.(e),
					LoadingController.SetProgress(
						GameModeController_1.OPENLOADING_END_PROGRESS,
						() => {
							NormalLoadingViewGlobalData_1.NormalLoadingViewGlobalData.FinishFirstProgressPromise(),
								a?.(!0);
						},
						1,
						!1,
						!1,
					);
			});
	}
	static async CloseLoadingView() {
		this.SetProgress(
			GameModeController_1.LOAD_FINISHED_PROGRESS,
			() => {
				NormalLoadingViewGlobalData_1.NormalLoadingViewGlobalData.FinishEndPromise();
			},
			GameModeController_1.LOADED_SPEED_RATE,
		),
			await NormalLoadingViewGlobalData_1.NormalLoadingViewGlobalData
				.FinishPromise?.Promise,
			ModelManager_1.ModelManager.LoadingModel.SetIsLoading(!1);
	}
	static OpenFadeLoadingView(e) {
		UiManager_1.UiManager.OpenView("FadeLoadingView", void 0, e);
	}
	static CloseFadeLoadingView(e) {
		UiManager_1.UiManager.CloseView("FadeLoadingView", e);
	}
	static OpenVideoCenterView(e) {
		UiManager_1.UiManager.OpenView("PlotTransitionView", void 0, e);
	}
	static CloseVideoCenterView(e) {
		UiManager_1.UiManager.CloseView("PlotTransitionView", e);
	}
	static SetProgress(e, o = void 0, a = 1, n = !1, r = !0) {
		Log_1.Log.CheckInfo() &&
			Log_1.Log.Info("Loading", 17, "SetProgress", ["progress", e]);
		var t = ModelManager_1.ModelManager.LoadingModel;
		o && t.ReachHandleQueue.Push([e, o]),
			n && ((t.CurrentProgress = 0), t.ReachHandleQueue.Clear()),
			(t.SpeedRate = a),
			(t.NextProgress = e),
			(t.NextProgress = Math.min(
				t.NextProgress,
				MathCommon_1.MathCommon.ProgressTotalValue,
			)),
			r || (t.CurrentProgress = e);
		if (e === 10) WuWaExec.ExecEngineIni();
	}
	static AddProgress(e, o) {
		var a = ModelManager_1.ModelManager.LoadingModel;
		for (
			a.NextProgress = Math.min(a.NextProgress + e, o),
				a.NextProgress = Math.min(
					a.NextProgress,
					MathCommon_1.MathCommon.ProgressTotalValue,
				);
			a.ReachHandleQueue.Size;
		) {
			var n = a.ReachHandleQueue.Front;
			if (n[0] > a.CurrentProgress) break;
			a.ReachHandleQueue.Pop(),
				n[1](),
				Log_1.Log.CheckInfo() &&
					Log_1.Log.Info(
						"Loading",
						17,
						"AddProgress",
						["progress", e],
						["maxProgress", o],
					);
		}
	}
}
(exports.LoadingController = LoadingController),
	((_a = LoadingController).Svi = (e) => {
		EventSystem_1.EventSystem.Emit(
			EventDefine_1.EEventName.OnLoadingNetDataDone,
		);
	}),
	(LoadingController.nye = () => {
		_a.UpdateUidViewShow();
	}),
	(LoadingController.FWe = () => {
		LoadingController.yea();
	}),
	(LoadingController.SYi = () => {
		LoadingController.Eea();
	}),
	(LoadingController.bpr = () => {
		LoadingController.Eea();
	}),
	(LoadingController.Ilt = () => {
		LoadingController.yea();
	}),
	(LoadingController.yvi = () => {
		ModelManager_1.ModelManager.LoadingModel.IsLoadingView && _a.Ivi();
	});
//# sourceMappingURL=LoadingController.js.map
