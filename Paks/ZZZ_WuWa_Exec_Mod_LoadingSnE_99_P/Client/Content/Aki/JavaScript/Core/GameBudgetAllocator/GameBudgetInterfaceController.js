"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
	(exports.GameBudgetInterfaceController = void 0);
const cpp_1 = require("cpp"),
	UE = require("ue"),
	WuWaExec = require("WuWaExec"),
	EventDefine_1 = require("../../Game/Common/Event/EventDefine"),
	EventSystem_1 = require("../../Game/Common/Event/EventSystem"),
	Global_1 = require("../../Game/Global"),
	ModelManager_1 = require("../../Game/Manager/ModelManager"),
	GameBudgetAllocatorConfigCreator_1 = require("../../Game/World/Define/GameBudgetAllocatorConfigCreator"),
	Log_1 = require("../Common/Log"),
	ControllerBase_1 = require("../Framework/ControllerBase"),
	PerfSight_1 = require("../PerfSight/PerfSight"),
	GameBudgetTimeEstimationFramesOffset_1 = require("./GameBudgetTimeEstimationFramesOffset");
class GameBudgetInterfaceController extends ControllerBase_1.ControllerBase {
	static get CenterRole() {
		return this.EK;
	}
	static get CurrentGlobalMode() {
		return this.RPa;
	}
	static OnInit() {
		return (
			EventSystem_1.EventSystem.Add(
				EventDefine_1.EEventName.OnChangeRole,
				this.SK,
			),
			EventSystem_1.EventSystem.Add(
				EventDefine_1.EEventName.OnBattleStateChanged,
				this.yK,
			),
			EventSystem_1.EventSystem.Add(
				EventDefine_1.EEventName.CameraModeChanged,
				this.IK,
			),
			(this.TK = 0),
			PerfSight_1.PerfSight.IsEnable &&
				cpp_1.FKuroPerfSightHelper.BeginExtTag("EGameBudgetMode.None"),
			super.OnInit()
		);
	}
	static OnClear() {
		return (
			EventSystem_1.EventSystem.Remove(
				EventDefine_1.EEventName.OnChangeRole,
				this.SK,
			),
			EventSystem_1.EventSystem.Remove(
				EventDefine_1.EEventName.OnBattleStateChanged,
				this.yK,
			),
			EventSystem_1.EventSystem.Remove(
				EventDefine_1.EEventName.CameraModeChanged,
				this.IK,
			),
			(this.LK = void 0),
			PerfSight_1.PerfSight.IsEnable &&
				(0 === this.TK
					? cpp_1.FKuroPerfSightHelper.EndExtTag("EGameBudgetMode.None")
					: 1 === this.TK
						? cpp_1.FKuroPerfSightHelper.EndExtTag("EGameBudgetMode.Normal")
						: 2 === this.TK &&
							cpp_1.FKuroPerfSightHelper.EndExtTag("EGameBudgetMode.Plot")),
			super.OnClear()
		);
	}
	static InitializeEnvironment(e) {
		cpp_1.FKuroGameBudgetAllocatorInterface.InitializeEnvironment(e),
			cpp_1.FKuroGameBudgetAllocatorInterface.SetUpdateCompensateEnable(0),
			this.DK &&
				cpp_1.FKuroGameBudgetAllocatorInterface.UpdateMinUpdateFIFOBudgetTime(
					this.DK,
				),
			this.RK.Initialize();
	}
	static IsEnvironmentValid() {
		return cpp_1.FKuroGameBudgetAllocatorInterface.IsEnvironmentValid();
	}
	static SetMaximumFrameRate(e) {
		cpp_1.FKuroGameBudgetAllocatorInterface.SetMaximumFrameRate(e),
			this.RK.SetMaximumFrameRate(e);
	}
	static UpdateMinUpdateFifoBudgetTime(e) {
		(this.DK = e),
			this.IsEnvironmentValid() &&
				cpp_1.FKuroGameBudgetAllocatorInterface.UpdateMinUpdateFIFOBudgetTime(
					e,
				);
		e === 9999
			? WuWaExec.ExecCVarFile("wuwa_exec_loading.txt")
			: (WuWaExec.ExecEngineIni(),
				WuWaExec.ExecCVarFile("wuwa_exec_ingame.txt"));
	}
	static UpdateBudgetTime(e) {
		this.RK.UpdateBudgetTime(e);
	}
	static RegisterTick(e, t, a, r, o = !0) {
		return this.UK.has(a)
			? (Log_1.Log.CheckWarn() &&
					Log_1.Log.Warn("Game", 25, "Object has already added!"),
				this.UK.get(a))
			: ((e = cpp_1.FKuroGameBudgetAllocatorInterface.RegisterFunction(
					e,
					t,
					r,
					a.ScheduledTick,
					a.ScheduledAfterTick,
					a.OnEnabledChange,
					o ? a.OnWasRecentlyRenderedOnScreenChange : void 0,
					a.LocationProxyFunction,
					a,
				)),
				this.UK.set(a, e),
				e);
	}
	static UnregisterTick(e) {
		var t = this.UK.get(e);
		t
			? (this.UK.delete(e),
				cpp_1.FKuroGameBudgetAllocatorInterface.UnregisterFunction(t))
			: Log_1.Log.CheckWarn() && Log_1.Log.Warn("Game", 25, "Not found error!");
	}
	static UpdateRegisterActor(e, t, a) {
		cpp_1.FKuroGameBudgetAllocatorInterface.UpdateActor(e, t, a);
	}
	static ComputeDistanceScore(e, t, a, r) {
		var e = new UE.Vector(e[0], e[1], e[2]),
			t = new UE.Vector(t[0], t[1], t[2]),
			o =
				(GameBudgetAllocatorConfigCreator_1.GameBudgetAllocatorConfigCreator
					.TsCharacterDtailConfig ||
					GameBudgetAllocatorConfigCreator_1.GameBudgetAllocatorConfigCreator.CreateCharacterEntityConfigOnly(),
				GameBudgetAllocatorConfigCreator_1.GameBudgetAllocatorConfigCreator
					.TsCharacterDtailConfig),
			r = r ? o.Normal_Render : o.Normal_NotRendered;
		return cpp_1.FKuroGameBudgetAllocatorInterface.ComputeDistanceScore(
			e,
			t,
			0.01 * r.TickReductionStartSize,
			0.01 * r.TickReductionIntervalSize,
			r.MaxInterval,
			a,
		);
	}
	static RegisterOnceTaskDefaultGroup(e, t, a) {
		cpp_1.FKuroGameBudgetAllocatorInterface.RegisterOnceTaskDefaultGroup(
			e,
			t,
			a,
		);
	}
	static ProduceOnceTaskOnDefaultGroup(e, t, a) {
		cpp_1.FKuroGameBudgetAllocatorInterface.ProduceOnceTask(e, t, a);
	}
	static RegisterOnceTaskCustomGroup(e) {
		cpp_1.FKuroGameBudgetAllocatorInterface.RegisterOnceTaskCustomGroup(
			e.GroupId,
			e.Priority,
			e.IsEmpty,
			e.Consume,
			e,
		);
	}
	static SetCenterRole(e) {
		e &&
			this.EK !== e &&
			(cpp_1.FKuroGameBudgetAllocatorInterface.SetCenterActor(e),
			(this.EK = e));
	}
	static SetUseBoundsCalculateDistance(e, t, a) {
		cpp_1.FKuroGameBudgetAllocatorInterface.SetUseBoundsCalculateDistance(
			e,
			t,
			a,
		);
	}
	static SetPerformanceLimitMode(e) {
		(this.AK = e), this.PK();
	}
	static SetPlotMode(e) {
		(this.IsInPlot = e), this.PK();
	}
	static PK() {
		var e = this.IsInPlot ? 2 : this.IsInFight && !this.AK ? 1 : 0;
		(this.RPa = e),
			cpp_1.FKuroGameBudgetAllocatorInterface.SetGlobalMode(e),
			Log_1.Log.CheckInfo() &&
				Log_1.Log.Info(
					"Game",
					37,
					"[GameBudget]RefreshGlobalMode",
					["IsInPlot", this.IsInPlot],
					["IsInFight", this.IsInFight],
					["IsPerformanceLimitMode", this.AK],
				);
	}
	static BK(e) {
		this.TK !== e &&
			(Log_1.Log.CheckInfo() &&
				Log_1.Log.Info(
					"Game",
					37,
					"[GameBudget]时间预算管理模式更改",
					["NewModel", e],
					["OldModel", this.TK],
				),
			PerfSight_1.PerfSight.IsEnable &&
				(0 === this.TK
					? cpp_1.FKuroPerfSightHelper.EndExtTag("EGameBudgetMode.None")
					: 1 === this.TK
						? cpp_1.FKuroPerfSightHelper.EndExtTag("EGameBudgetMode.Normal")
						: 2 === this.TK &&
							cpp_1.FKuroPerfSightHelper.EndExtTag("EGameBudgetMode.Plot"),
				0 === e
					? cpp_1.FKuroPerfSightHelper.BeginExtTag("EGameBudgetMode.None")
					: 1 === e
						? cpp_1.FKuroPerfSightHelper.BeginExtTag("EGameBudgetMode.Normal")
						: 2 === e &&
							cpp_1.FKuroPerfSightHelper.BeginExtTag("EGameBudgetMode.Plot")),
			this.bK(this.TK),
			(this.TK = e),
			this.qK(e));
	}
	static qK(e) {
		1 === e
			? this.SetCenterRole(Global_1.Global.BaseCharacter)
			: 2 === e &&
				(this.SetCenterRole(Global_1.Global.BaseCharacter),
				(e =
					ModelManager_1.ModelManager.CameraModel?.SequenceCamera
						?.DisplayComponent?.CineCamera)) &&
				((this.LK = e),
				cpp_1.FKuroGameBudgetAllocatorInterface.AddAssistantActor(e));
	}
	static bK(e) {
		2 === e &&
			this.LK &&
			(cpp_1.FKuroGameBudgetAllocatorInterface.RemoveAssistantActor(this.LK),
			(this.LK = void 0));
	}
}
(exports.GameBudgetInterfaceController = GameBudgetInterfaceController),
	((_a = GameBudgetInterfaceController).IsOpen = !0),
	(GameBudgetInterfaceController.UK = new Map()),
	(GameBudgetInterfaceController.TsGlobalFifoTaskGroupName = new UE.FName(
		"TsGlobalFifoTaskGroup",
	)),
	(GameBudgetInterfaceController.TsGlobalFifoTaskSignificanceGroup = 2),
	(GameBudgetInterfaceController.EK = void 0),
	(GameBudgetInterfaceController.DK = void 0),
	(GameBudgetInterfaceController.IsInPlot = !1),
	(GameBudgetInterfaceController.IsInFight = !1),
	(GameBudgetInterfaceController.AK = !1),
	(GameBudgetInterfaceController.RPa = 0),
	(GameBudgetInterfaceController.RK =
		new GameBudgetTimeEstimationFramesOffset_1.GameBudgetTimeEstimationFramesOffset()),
	(GameBudgetInterfaceController.yK = (e) => {
		(_a.IsInFight = e),
			_a.IsInFight &&
				_a.IsInPlot &&
				((_a.IsInPlot = !1), Log_1.Log.CheckError()) &&
				Log_1.Log.Error(
					"Game",
					37,
					"[GameBudget]进入战斗时时间预算管理仍然处于剧情模式",
				),
			_a.PK();
	}),
	(GameBudgetInterfaceController.SK = (e, t) => {
		_a.SetCenterRole(Global_1.Global.BaseCharacter);
	}),
	(GameBudgetInterfaceController.TK = 0),
	(GameBudgetInterfaceController.LK = void 0),
	(GameBudgetInterfaceController.IK = (e, t) => {
		1 === e && ModelManager_1.ModelManager.PlotModel?.IsInPlot
			? _a.BK(2)
			: _a.BK(1);
	});
//# sourceMappingURL=GameBudgetInterfaceController.js.map
