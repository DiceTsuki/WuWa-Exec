# This mod modifies the game file. Use it at yout own risk!


# WuWa Exec
A Wuthering Waves' mod for executing Unreal Engine 4 Console Variables (CVars) from external files (including `Engine.ini`) during gameplay.

This Readme is for `v1.1.20240725`.

# Compatibility
1. Compatible with `Wuthering Waves 1.1.x`.
2. Compatible with mods that don't modify `Client\Content\Aki\JavaScript\Core\GameBudgetAllocator\GameBudgetInterfaceController.js`.
3. Compatible with mods that modify `Client\Content\Aki\JavaScript\Core\Resource\ResourceSystem.js`,<br>as long as `GameBudgetInterfaceController_1.GameBudgetInterfaceController.UpdateMinUpdateFifoBudgetTime()` remains unchanged.
4. Only CVars that can be executed from Unreal Engine 4's Developer Console can be used with this mod.
   <br>Take note that some of them are set to read-only*, disabled or removed from the game.<br>
\* Will be read (from `Engine.ini` or other sources) and executed once during launch and can't be changed during runtime.

# Installation
1. Extract `Wuthering Waves Game` folder from the archive into `Wuthering Waves` folder (contains `launcher.exe`).
2. Follow [this guide](https://github.com/aarlin/wuthering-waves-mod-starter/?tab=readme-ov-file#how-to-install-mods) (skip the copying `~mods` folder part) on how to activate mods.


# Uninstallation
1. Go to `Wuthering Waves Game\Client\Content\Paks\~mods\` and delete `ZZZ_WuWa_Exec_99_P.pak`.
2. Go to `Wuthering Waves Game\Client\Binaries\` and delete:
   ```
   wuwa_exec_engineini_blacklist.txt
   wuwa_exec_engineini_whitelist.txt
   wuwa_exec_ingame.txt
   wuwa_exec_loading.txt.
   ```


# CVars Execution
CVars will be read from files below:
| File                    | Execution                                                                                                                                                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `wuwa_exec_loading.txt` | At loading's start.<br>Known loadings which will trigger the mod:<br>1. Loading with background image.<br>2. Loading before entering Login menu.<br>3. Loading before entering Resonators menu. <br>4. Loading before entering Gacha animation. |
| `Engine.ini`            | At loading's end.                                                                                                                                                                                                                               |
| `wuwa_exec_ingame.txt`  | At loading's end, after `Engine.ini`.                                                                                                                                                                                                           |

Loading Summary:<br>
Start Loading > Execute `wuwa_exec_loading.txt` > Loading... > Execute `Engine.ini` > Execute `wuwa_exec_ingame.txt` > End loading.


# Configuration
## Mode: Loading's Start and End
Both preloaded config. files are empty.
### Loading's Start
| About        | Detail                             |
|--------------|------------------------------------|
| Config. File | `wuwa_exec_loading.txt`            |
| Content      | CVars.                             |
| Function     | Execute CVars listed.              |
| Activation   | Add at least 1 CVar.               |
| Deactivation | Leave the file empty or delete it. |

### Loading's End
| About        | Detail                             |
|--------------|------------------------------------|
| Config. File | `wuwa_exec_ingame.txt`             |
| Content      | CVars.                             |
| Function     | Execute CVars listed.              |
| Activation   | Add at least 1 CVar.               |
| Deactivation | Leave the file empty or delete it. |

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

## Mode: Engine.ini
Both preloaded config. files are already filled with necessary data.
### Blacklist (Default)
| About        | Detail                                                                  |
|--------------|-------------------------------------------------------------------------|
| Config. File | `wuwa_exec_engineini_blacklist.txt`                                     |
| Content      | `[Sections]` (as in `Engine.ini`).                                      |
| Function     | Execute CVars in `Engine.ini` that are `not` under `[Sections]` listed. |
| Activation   | The file exists.                                                        |
| Deactivation | Delete the file.                                                        |

### Whitelist (After Blacklist was Deactivated)
| About        | Detail                                                            |
|--------------|-------------------------------------------------------------------|
| Config. File | `wuwa_exec_engineini_whitelist.txt`                               |
| Content      | `[Sections]` (as in `Engine.ini`).                                |
| Function     | Execute CVars in `Engine.ini` that are under `[Sections]` listed. |
| Activation   | Blacklist is deactivated and the file exists.                     |
| Deactivation | Leave the file empty or delete it.                                |

### [Section] Formatting
`[Section]` is case-sensitive.<br>
Make sure that the case is similar to the target `[Section]`.

### TXT Files' Content
Add 1 `[Section]` per line.

e.g.

```
[/Script/WindowsTargetPlatform.WindowsTargetSettings]
[Core.System]
[Core.Log]
[WindowsApplication.Accessibility]
```

# Issues
1. The game won't execute `wuwa_exec_loading.txt` during intial loading before entering login menu.
