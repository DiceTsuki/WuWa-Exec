# This mod modifies the game files. Use it at yout own risk!


# WuWa Exec
A Wuthering Waves' mod for executing Unreal Engine 4 (UE4) Console Variables (CVars) from external files (including `Engine.ini`) during gameplay.

This Readme is for `v1.1.20240731`.

# Compatibility
1. Compatible with `Wuthering Waves 1.1.x`.
2. Compatible with mods that don't override the same [files](#mod-paks).
3. CVars must be executable from UE4 Developer's Console.
   <br>Take note that some of them are set to read-only*, disabled or removed from the game.<br>
\* Executed once during launch and can't be changed during runtime.

# Installation
1. Extract `Wuthering Waves Game` folder from the archive into `Wuthering Waves` folder (contains `launcher.exe`).
2. Follow [this guide](https://github.com/aarlin/wuthering-waves-mod-starter/?tab=readme-ov-file#how-to-install-mods) (skip the copying `~mods` folder part) on how to activate mods.


# Uninstallation
1. Go to `Wuthering Waves Game\Client\Content\Paks\~mods\` and delete:
   ```
   ZZZ_WuWa_Exec_Core_99_P.pak
   ZZZ_WuWa_Exec_Mod_Loading10Pc_99_P.pak
   ZZZ_WuWa_Exec_Mod_LoadingSnE_99_P.pak
   ```
2. Go to `Wuthering Waves Game\Client\Binaries\` and delete:
   ```
   wuwa_exec_engineini_blacklist.txt
   wuwa_exec_engineini_whitelist.txt
   wuwa_exec_ingame.txt
   wuwa_exec_loading.txt.
   ```


# Mod Paks
## ZZZ_WuWa_Exec_Core_99_P.pak (Required)
| About    | Detail                                                                                                                          |
|----------|---------------------------------------------------------------------------------------------------------------------------------|
| Function | Store core module required by other WuWa Exec mod paks.                                                                         |
| Config.  | `wuwa_exec_engineini_blacklist.txt`<br>`wuwa_exec_engineini_whitelist.txt`<br>`wuwa_exec_ingame.txt`<br>`wuwa_exec_loading.txt` |
| Warning  | 1. Will do nothing on its own.<br>2. Only delete on uninstall!                                                                  |

## ZZZ_WuWa_Exec_Mod_Loading10Pc_99_P.pak (Optional)
| About    | Detail                                                                                                                                                                                            |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Override | `Client\Content\Aki\JavaScript\Game\Module\Loading\LoadingController.js`                                                                                                                          |
| Function | Execute CVars from `Engine.ini` at 10% loading (only for loading with background image).                                                                                                          |
| Purpose  | Override forced CVars during loading (occur before 10%) after login menu.<br>Thus forcing the game to follow `Engine.ini` throughout the loading.<br>This is useful for CVars such as `r.SetRes`. |
| Config.  | `wuwa_exec_engineini_blacklist.txt`<br>`wuwa_exec_engineini_whitelist.txt`                                                                                                                        |
| Trigger  | Loading with background image (at 10%).                                                                                                                                                           |
| Optional | Delete if not needed.                                                                                                                                                                             |

## ZZZ_WuWa_Exec_Mod_LoadingSnE_99_P.pak (Optional)
| About      | Detail                                                                                                                                                                 |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Override   | `Client\Content\Aki\JavaScript\Core\GameBudgetAllocator\GameBudgetInterfaceController.js`                                                                              |
| Depends On | `GameBudgetInterfaceController_1.GameBudgetInterfaceController.UpdateMinUpdateFifoBudgetTime()` in <br>`Client\Content\Aki\JavaScript\Core\Resource\ResourceSystem.js` |
| Function   | Execute CVars at (from):<br>1. Loading's start (`wuwa_exec_loading.txt`).<br>2. Loading's end (`Engine.ini`, then `wuwa_exec_ingame.txt`).                             |
| Purpose    | 1. Execute just after `wp.Runtime.MaxLoadingLevelStreamingCells`. You can override it if needed.<br>2. Testing CVars live ingame (see `Trigger`).                      |
| Config.    | `wuwa_exec_engineini_blacklist.txt`<br>`wuwa_exec_engineini_whitelist.txt`<br>`wuwa_exec_ingame.txt`<br>`wuwa_exec_loading.txt`                                        |
| Trigger    | 1. Loading with background image.<br>2. Loading before Login menu.<br>3. Loading before Resonators menu.<br>4. Loading before Gacha animation.                         |
| Optional   | Delete if not needed.                                                                                                                                                  |


# Configuration
## wuwa_exec_ingame.txt<br>wuwa_exec_loading.txt
| About    | Detail                      |
|----------|-----------------------------|
| Function | Store CVars for execution.  |
| Content  | CVars.                      |
| Enable   | Add at least 1 CVar.        |
| Disable  | Leave it empty / delete it. |

### CVar Formatting
Separate CVar and it's value by `space` e.g. `r.ScreenPercentage 90`.

### TXT Files' Content
Add 1 CVar per line.<br>
`[Sections]` (as in `Engine.ini`) are not needed.

e.g.

```
t.MaxFPS 0
r.SetRes 1920x1080f
r.ScreenPercentage 90
```
Note: By default, the txt files are empty.

## wuwa_exec_engineini_blacklist.txt (Default)
| About    | Detail                                                                                                           |
|----------|------------------------------------------------------------------------------------------------------------------|
| Function | Store `[Sections]`.<br>CVars under them, inside `Engine.ini` will `not` be executed.<br>Others will be executed. |
| Content  | `[Sections]` (as in `Engine.ini`).                                                                               |
| Enable   | It exists.                                                                                                       |
| Disable  | Delete it.                                                                                                       |

## wuwa_exec_engineini_whitelist.txt (Used After Blacklist was Disabled)
| About    | Detail                                                                                                           |
|----------|------------------------------------------------------------------------------------------------------------------|
| Function | Store `[Sections]`.<br>CVars under them, inside `Engine.ini` will be executed.<br>Others will `not` be executed. |
| Content  | `[Sections]` (as in `Engine.ini`).                                                                               |
| Enable   | Blacklist was disabled, and the file exists.                                                                     |
| Disable  | Leave it empty / delete it.                                                                                      |

### [Section] Formatting
`[Section]` is case-sensitive.<br>
Make sure that the case is similar to the target `[Section]` inside `Engine.ini`.

### TXT Files' Content
Add 1 `[Section]` per line.

e.g.

```
[/Script/WindowsTargetPlatform.WindowsTargetSettings]
[Core.System]
[Core.Log]
[WindowsApplication.Accessibility]
```
Note: By default, the txt files are preloaded with necessary `[Sections]`.

# Issues
1. The mod will not take effect during intial loading (when integrity check occurs).
