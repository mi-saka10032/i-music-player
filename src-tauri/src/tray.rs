use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTraySubmenu, Window,
};

#[derive(Clone, serde::Serialize)]
pub struct SingleInstancePayload {
    pub args: Vec<String>,
    pub cwd: String,
}

pub fn show_window(window: Window) {
    if !window.is_visible().unwrap() {
        window.show().unwrap();
    }
    if window.is_minimized().unwrap() {
        window.unminimize().unwrap();
    }
    if !window.is_focused().unwrap() {
        window.set_focus().unwrap();
    }
}

pub const MAIN_WINDOW_LABEL: &str = "main";

enum MenuItemId {
    SwitchPlayStatus,
    SwitchPrev,
    SwitchNext,
    SwitchRepeatMode,
    SwitchModeLoop,
    SwitchRepeatSingle,
    SwitchRepeatShuffle,
    SwitchRepeatSequential,
    Quit,
}

impl MenuItemId {
    fn as_str(&self) -> &str {
        match self {
            MenuItemId::SwitchPlayStatus => "play_status",
            MenuItemId::SwitchPrev => "prev",
            MenuItemId::SwitchNext => "next",
            MenuItemId::SwitchRepeatMode => "repeat_mode",
            MenuItemId::SwitchModeLoop => "loop",
            MenuItemId::SwitchRepeatSingle => "single",
            MenuItemId::SwitchRepeatShuffle => "shuffle",
            MenuItemId::SwitchRepeatSequential => "sequential",
            MenuItemId::Quit => "quit",
        }
    }

    fn from_str(id: &str) -> Option<Self> {
        match id {
            "play_status" => Some(MenuItemId::SwitchPlayStatus),
            "prev" => Some(MenuItemId::SwitchPrev),
            "next" => Some(MenuItemId::SwitchNext),
            "repeat_mode" => Some(MenuItemId::SwitchRepeatMode),
            "loop" => Some(MenuItemId::SwitchModeLoop),
            "single" => Some(MenuItemId::SwitchRepeatSingle),
            "shuffle" => Some(MenuItemId::SwitchRepeatShuffle),
            "sequential" => Some(MenuItemId::SwitchRepeatSequential),
            "quit" => Some(MenuItemId::Quit),
            _ => None,
        }
    }
}

pub fn generate_menu(repeat_mode: &str) -> SystemTrayMenu {
    let mut repeat_mode_menus = SystemTrayMenu::new();

    let repeat_mode_vec: Vec<(MenuItemId, String)> = vec![
        (MenuItemId::SwitchModeLoop, String::from("列表循环")),
        (MenuItemId::SwitchRepeatSingle, String::from("单曲循环")),
        (MenuItemId::SwitchRepeatShuffle, String::from("随机播放")),
        (MenuItemId::SwitchRepeatSequential, String::from("顺序播放")),
    ];

    for mut item in repeat_mode_vec {
        let prefix = if item.0.as_str() == repeat_mode {
            "✔ "
        } else {
            "    "
        };
        item.1 = format!("{}{}", prefix, item.1);
        repeat_mode_menus =
            repeat_mode_menus.add_item(CustomMenuItem::new(item.0.as_str(), item.1));
    }

    let repeat_mode_sub_menu = SystemTraySubmenu::new("播放模式", repeat_mode_menus);

    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new(
            MenuItemId::SwitchPlayStatus.as_str(),
            "▶ 播放 / ⏸ 暂停",
        ))
        .add_item(CustomMenuItem::new(
            MenuItemId::SwitchPrev.as_str(),
            "⏮ 上一首",
        ))
        .add_item(CustomMenuItem::new(
            MenuItemId::SwitchNext.as_str(),
            "⏭ 下一首",
        ))
        .add_submenu(repeat_mode_sub_menu)
        .add_item(CustomMenuItem::new(MenuItemId::Quit.as_str(), "退出")); // 退出

    tray_menu
}

// 托盘菜单
pub fn init_menu() -> SystemTray {
    let tray_menu = generate_menu("");

    // 设置在右键单击系统托盘时显示菜单
    let mut tray_builder = SystemTray::new();

    tray_builder = tray_builder
        .with_menu(tray_menu)
        .with_tooltip("i-music-player");

    #[cfg(target_os = "macos")]
    {
        tray_builder = tray_builder
            .with_menu_on_left_click(false)
            .with_title("i-music-player");
    }

    tray_builder
}

// 菜单事件
pub fn event_handler(app: &AppHandle, event: SystemTrayEvent) {
    // 获取应用窗口
    let window = app.get_window(MAIN_WINDOW_LABEL).unwrap();

    // 匹配点击事件
    match event {
        // 左键点击
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            show_window(window);
        }
        // 根据菜单 id 进行事件匹配
        SystemTrayEvent::MenuItemClick { id, .. } => {
            if let Some(menu_id) = MenuItemId::from_str(id.as_str()) {
                match menu_id {
                    MenuItemId::SwitchPlayStatus => {
                        app.emit_to(
                            MAIN_WINDOW_LABEL,
                            MenuItemId::SwitchPlayStatus.as_str(),
                            None::<()>,
                        )
                        .unwrap();
                    }
                    MenuItemId::SwitchPrev => {
                        app.emit_to(
                            MAIN_WINDOW_LABEL,
                            MenuItemId::SwitchPrev.as_str(),
                            None::<()>,
                        )
                        .unwrap();
                    }
                    MenuItemId::SwitchNext => {
                        app.emit_to(
                            MAIN_WINDOW_LABEL,
                            MenuItemId::SwitchNext.as_str(),
                            None::<()>,
                        )
                        .unwrap();
                    }
                    MenuItemId::SwitchModeLoop => {
                        app.emit_to(
                            MAIN_WINDOW_LABEL,
                            MenuItemId::SwitchRepeatMode.as_str(),
                            MenuItemId::SwitchModeLoop.as_str(),
                        )
                        .unwrap();
                    }
                    MenuItemId::SwitchRepeatSingle => {
                        app.emit_to(
                            MAIN_WINDOW_LABEL,
                            MenuItemId::SwitchRepeatMode.as_str(),
                            MenuItemId::SwitchRepeatSingle.as_str(),
                        )
                        .unwrap();
                    }
                    MenuItemId::SwitchRepeatShuffle => {
                        app.emit_to(
                            MAIN_WINDOW_LABEL,
                            MenuItemId::SwitchRepeatMode.as_str(),
                            MenuItemId::SwitchRepeatShuffle.as_str(),
                        )
                        .unwrap();
                    }
                    MenuItemId::SwitchRepeatSequential => {
                        app.emit_to(
                            MAIN_WINDOW_LABEL,
                            MenuItemId::SwitchRepeatMode.as_str(),
                            MenuItemId::SwitchRepeatSequential.as_str(),
                        )
                        .unwrap();
                    }
                    MenuItemId::Quit => {
                        let _ = window.close();
                        std::process::exit(0);
                    }
                    _ => {}
                }
            }
        }
        _ => {}
    }
}
