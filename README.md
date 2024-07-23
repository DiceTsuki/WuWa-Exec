# This mod modifies the game file. Use it at yout own risk!


# WuWa Exec
A Wuthering Waves' mod for executing Unreal Engine 4 Console Variables (CVars) from external files during gameplay.


# Compatibility
1. Compatible with `Wuthering Waves 1.1.x`.
2. Compatible with mods that don't modify `Client\Content\Aki\JavaScript\Core\GameBudgetAllocator\GameBudgetInterfaceController.js`.
3. Compatible with mods that modify `Client\Content\Aki\JavaScript\Core\Resource\ResourceSystem.js`, as long as `GameBudgetInterfaceController_1.GameBudgetInterfaceController.UpdateMinUpdateFifoBudgetTime()` is not changed.
4. Only CVars that can be executed from Unreal Engine 4's Developer Console can be used with this mod.
   <br>Take note that some of them are disabled/removed from the game. 


# Installation
1. Extract `Wuthering Waves Game` folder from the archive into `Wuthering Waves` folder (contains `launcher.exe`).
2. Follow [this guide](https://github.com/aarlin/wuthering-waves-mod-starter/?tab=readme-ov-file#how-to-install-mods) (skip the copying `~mods` folder part) on how to activate mods.


# Uninstallation
1. Go to `Wuthering Waves Game\Client\Content\Paks\~mods\` and delete `ZZZ_WuWa_Exec_99_P.pak`.
2. Go to `Wuthering Waves Game\Client\Binaries\` and delete `wuwa_exec_loading.txt`, `wuwa_exec_ingame.txt` and `wuwa_exec.txt`.


# CVar Formatting
CVar format is different from `Engine.ini`.<br>
`CVar`[space]`Value` is used instead of `CVar`=`Value`.<br>

e.g.<br>
`r.ScreenPercentage=90` needs to be changed to `r.ScreenPercentage 90`


# CVar Location
Go to `Wuthering Waves Game\Client\Binaries\` and put your CVars inside one of these files:

| File                    | CVars Execution                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `wuwa_exec_loading.txt` | At the start of loading e.g.<br>1. Loading with background image.<br>2. Loading before entering Resonators menu.<br>3. Loading before entering gacha animation. |
| `wuwa_exec_ingame.txt`  | At the end of loading.<br>Usually when you can take control of the game.                                                                                        |
| `wuwa_exec.txt`         | Before executing CVars from other files.<br>Other files will overwrite similar CVars from this file.                                                            |

Loading Summary:<br>
Start Loading > Execute from `wuwa_exec.txt` > Execute from `wuwa_exec_loading.txt` > Loading... > Execute from `wuwa_exec.txt` > Execute from `wuwa_exec_ingame.txt` > End loading.


# TXT File's Content
Put one CVar per line.<br>
Sections like `Engine.ini` e.g. `[SystemSettings]`, `[Core.Log]` etc. are not needed.<br>

Example of txt file's content:
```
t.MaxFPS 0
r.SetRes 1920x1080f
r.ScreenPercentage 90
```


# Issues
1. The game won't execute `wuwa_exec_loading.txt` (and `wuwa_exec.txt` before it) during intial loading before entering login menu.
