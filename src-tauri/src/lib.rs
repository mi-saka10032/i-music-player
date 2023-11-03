

#[macro_use]
mod macros;

mod crypto;
mod music_api;
mod request;

use serde::Deserialize;

#[derive(Debug)]
#[derive(Deserialize)]
pub struct Options<'a> {
    method: &'a str,
    url: &'a str,
    params: Vec<(&'a str, &'a str)>,
    cookie: &'a str,
}


use serde::{Serialize};
#[derive(Serialize)]
pub struct FormatParams {
    url: String,
    headers: Vec<(String, String)>,
    body: String,
    method: String
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(message: String) {}

#[tauri::command]
fn get_params(options: Options) -> FormatParams {
    match options.url {
        "/album/detail/dynamic" => music_api::index_album_detail_dynamic(options),
        "/album/newest" => music_api::index_album_newest(options),
        "/album/sub" => music_api::index_album_sub(options),
        "/album/sublist" => music_api::index_album_sublist(options),
        "/album" => music_api::index_album(options),
        "/artist/album" => music_api::index_artist_album(options),
        "/artist/desc" => music_api::index_artist_desc(options),
        "/artist/list" => music_api::index_artist_list(options),
        "/artist/mv" => music_api::index_artist_mv(options),
        "/artist/sub" => music_api::index_artist_sub(options),
        "/artist/sublist" => music_api::index_artist_sublist(options),
        "/artist/top/song" => music_api::index_artist_top_song(options),
        "/artists" => music_api::index_artists(options),
        "/banner" => music_api::index_banner(options),
        "/check/music" => music_api::index_check_music(options),
        "/comment/album" => music_api::index_comment_album(options),
        "/comment/dj" => music_api::index_comment_dj(options),
        "/comment/event" => music_api::index_comment_event(options),
        "/comment/hot" => music_api::index_comment_hot(options),
        "/comment/hotwall/list" => music_api::index_comment_hotwall_list(options),
        "/comment/like" => music_api::index_comment_like(options),
        "/comment/music" => music_api::index_comment_music(options),
        "/comment/mv" => music_api::index_comment_mv(options),
        "/comment/playlist" => music_api::index_comment_playlist(options),
        "/comment" => music_api::index_comment(options),
        "/daily_signin" => music_api::index_daily_sigin(options),
        "/digitalAlbum/purchased" => music_api::index_digitalAlbum_purchased(options),
        "/dj/banner" => music_api::index_dj_banner(options),
        "/dj/category/excludehot" => music_api::index_dj_category_excludehot(options),
        "/dj/category/recommend" => music_api::index_dj_category_recommend(options),
        "/dj/catelist" => music_api::index_dj_catelist(options),
        "/dj/detail" => music_api::index_dj_detail(options),
        "/dj/hot" => music_api::index_dj_hot(options),
        "/dj/paygift" => music_api::index_dj_paygift(options),
        "/dj/program/detail" => music_api::index_dj_program_detail(options),
        "/dj/program/toplist/hours" => music_api::index_dj_program_toplist_hours(options),
        "/dj/program/toplist" => music_api::index_dj_program_toplist(options),
        "/dj/program" => music_api::index_dj_program(options),
        "/dj/radio/hot" => music_api::index_dj_radio_hot(options),
        "/dj/recommend/type" => music_api::index_dj_recommend_type(options),
        "/dj/recommend" => music_api::index_dj_recommend(options),
        "/dj/sub" => music_api::index_dj_sub(options),
        "/dj/sublist" => music_api::index_dj_sublist(options),
        "/dj/today/perfered" => music_api::index_dj_today_perfered(options),
        "/dj/toplist/hours" => music_api::index_dj_toplist_hours(options),
        "/dj/toplist/newcomer" => music_api::index_dj_toplist_newcomer(options),
        "/dj/toplist/pay" => music_api::index_dj_toplist_pay(options),
        "/dj/toplist/popular" => music_api::index_dj_toplist_popular(options),
        "/dj/toplist" => music_api::index_dj_toplist(options),
        "/event/del" => music_api::index_event_del(options),
        "/event/forward" => music_api::index_event_forward(options),
        "/event" => music_api::index_event(options),
        "/fm/trash" => music_api::index_fm_trash(options),
        "/follow" => music_api::index_follow(options),
        "/hot/topic" => music_api::index_hot_topic(options),
        "/like" => music_api::index_like(options),
        "/likelist" => music_api::index_likelist(options),
        "/login/cellphone" => music_api::index_login_cellphone(options),
        "/login/qr/key" => music_api::index_login_qr_key(options),
        "/login/qr/create" => music_api::index_login_qr_create(options),
        "/login/qr/check" => music_api::index_login_qr_check(options),
        "/login/status" => music_api::index_login_status(options),
        "/login/refresh" => music_api::index_login_refresh(options),
        "/logout" => music_api::index_logout(options),
        "/lyric" => music_api::index_lyric(options),
        "/msg/comments" => music_api::index_msg_comments(options),
        "/msg/forwards" => music_api::index_msg_forwards(options),
        "/msg/notices" => music_api::index_msg_notices(options),
        "/msg/private/history" => music_api::index_msg_private_history(options),
        "/msg/private" => music_api::index_msg_private(options),
        "/mv/all" => music_api::index_mv_all(options),
        "/mv/detail" => music_api::index_mv_detail(options),
        "/mv/exclusive/rcmd" => music_api::index_mv_exclusive_rcmd(options),
        "/mv/first" => music_api::index_mv_first(options),
        "/mv/sub" => music_api::index_mv_sub(options),
        "/mv/sublist" => music_api::index_mv_sublist(options),
        "/mv/url" => music_api::index_mv_url(options),
        "/personal/fm" => music_api::index_personal_fm(options),
        "/personalized/djprogram" => music_api::index_personalized_djprogram(options),
        "/personalized/mv" => music_api::index_personalized_mv(options),
        "/personalized/newsong" => music_api::index_personalized_newsong(options),
        "/personalized/privatecontent" => music_api::index_personalized_privatecontent(options),
        "/personalized" => music_api::index_personalized(options),
        "/playlist/catlist" => music_api::index_playlist_catlist(options),
        "/playlist/create" => music_api::index_playlist_create(options),
        "/playlist/delete" => music_api::index_playlist_delete(options),
        "/playlist/desc_update" => music_api::index_playlist_desc_update(options),
        "/playlist/detail" => music_api::index_playlist_detail(options),
        "/playlist/hot" => music_api::index_playlist_hot(options),
        "/playlist/name/update" => music_api::index_playlist_name_update(options),
        "/playlist/subscribe" => music_api::index_playlist_subscribe(options),
        "/playlist/subscribers" => music_api::index_playlist_subscribers(options),
        "/playlist/tags/update" => music_api::index_playlist_tags_update(options),
        "/playlist/tracks" => music_api::index_playlist_tracks(options),
        "/playlist/update" => music_api::index_playlist_update(options),
        "/playmode/intelligence/list" => music_api::index_playmode_intelligence_list(options),
        "/program/recommend" => music_api::index_program_recommend(options),
        "/rebind" => music_api::index_rebind(options),
        "/recommend/resource" => music_api::index_recommend_resource(options),
        "/recommend/songs" => music_api::index_recommend_songs(options),
        "/register/cellphone" => music_api::index_register_cellphone(options),
        "/related/allvideo" => music_api::index_related_allvideo(options),
        "/related/playlist" => music_api::index_related_playlist(options),
        "/resource/like" => music_api::index_resource_like(options),
        "/search/default" => music_api::index_search_default(options),
        "/search/hot/detail" => music_api::index_search_hot_detail(options),
        "/search/hot" => music_api::index_search_hot(options),
        "/search/multimatch" => music_api::index_search_multimatch(options),
        "/search/suggest" => music_api::index_search_suggest(options),
        "/search" => music_api::index_search(options),
        "/send/playlist" => music_api::index_send_playlist(options),
        "/send/text" => music_api::index_send_text(options),
        "/setting" => music_api::index_setting(options),
        "/share/resource" => music_api::index_share_resource(options),
        "/simi/artist" => music_api::index_simi_artist(options),
        "/simi/mv" => music_api::index_simi_mv(options),
        "/simi/playlist" => music_api::index_simi_playlist(options),
        "/simi/song" => music_api::index_simi_song(options),
        "/simi/user" => music_api::index_simi_user(options),
        "/song/detail" => music_api::index_song_detail(options),
        "/song/url" => music_api::index_song_url(options),
        "/top/album" => music_api::index_top_album(options),
        "/top/artist" => music_api::index_top_artist(options),
        "/top/list" => music_api::index_top_list(options),
        "/top/mv" => music_api::index_top_mv(options),
        "/top/playlist/highquality" => music_api::index_top_playlist_highquality(options),
        "/top/playlist" => music_api::index_top_playlist(options),
        "/top/song" => music_api::index_top_song(options),
        "/toplist/artist" => music_api::index_toplist_artist(options),
        "/toplist/detail" => music_api::index_toplist_detail(options),
        "/toplist" => music_api::index_toplist(options),
        "/user/audio" => music_api::index_user_audio(options),
        "/user/cloud/del" => music_api::index_user_cloud_del(options),
        "/user/cloud/detail" => music_api::index_user_cloud_detail(options),
        "/user/cloud" => music_api::index_user_cloud(options),
        "/user/detail" => music_api::index_user_detail(options),
        "/user/dj" => music_api::index_user_dj(options),
        "/user/event" => music_api::index_user_event(options),
        "/user/followeds" => music_api::index_user_followeds(options),
        "/user/follows" => music_api::index_user_follows(options),
        "/user/playlist" => music_api::index_user_playlist(options),
        "/user/record" => music_api::index_user_record(options),
        "/user/account" => music_api::index_user_account(options),
        "/user/subcount" => music_api::index_user_subcount(options),
        "/user/update" => music_api::index_user_update(options),
        "/video/detail" => music_api::index_video_detail(options),
        "/video/group/list" => music_api::index_video_group_list(options),
        "/video/group" => music_api::index_video_group(options),
        "/video/sub" => music_api::index_video_sub(options),
        "/video/url" => music_api::index_video_url(options),
        "/weblog" => music_api::index_weblog(options),
        _ => FormatParams {
            url: "".to_string(),
            headers: vec![],
            body: "".to_string(),
            method: "POST".to_string()
        },
    }
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
      .plugin(tauri_plugin_sql::Builder::default().build())
      .invoke_handler(tauri::generate_handler![greet, get_params])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
