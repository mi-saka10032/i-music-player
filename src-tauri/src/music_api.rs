use urlqstring::QueryParams;

use crate::crypto::{Crypto, HashType};

use crate::request::generate_response;
use std::collections::HashMap;

use crate::Options;
use crate::FormatParams;


fn get_cookie_string(cookie: &str) -> String {
    if !cookie.is_empty() {
        cookie.to_string()
    } else {
        format!("NMTID={};", Crypto::hex_random_bytes(16))
    }
}

fn empty_query_params_handler(url: &str, crypto: &str, cookie: &str) -> FormatParams {
    let query_params = json_object!({});

    let cookies = get_cookie_string(cookie);
    let request_params = json_object!({
        "crypto": crypto,
        "cookie": &cookies,
        "proxy": ""
    });

    generate_response(url, "POST", query_params, request_params)
}

fn request_handler(
    url: &str,
    crypto: &str,
    query_params: HashMap<&str, &str>,
    cookies: &str,
) -> FormatParams {
    let request_params = json_object!({
        "crypto": crypto,
        "cookie": cookies,
        "proxy": ""
    });

    generate_response(url, "POST", query_params, request_params)
}

// #[get("/album/detail/dynamic")]
pub(crate) fn index_album_detail_dynamic(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/album/detail/dynamic";
    let cookies = get_cookie_string(options.cookie);
    let query_string = QueryParams::from(options.params);

    let query_params = json_object!({
        "id": query_string.value("id").unwrap_or_default()
    });

    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/album/newest")]
pub(crate) fn index_album_newest(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/discovery/newAlbum";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/album/sub")]
pub(crate) fn index_album_sub(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let sub = query_string
        .value("t")
        .unwrap_or("0")
        .parse::<i32>()
        .unwrap();
    let url = &format!(
        "https://music.163.com/api/album/{}",
        if sub == 1 { "sub" } else { "unsub" }
    );

    let cookies = get_cookie_string(options.cookie);
    let query_params = json_object!({
        "id": query_string.value("id").unwrap()
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/album/sublist")]
pub(crate) fn index_album_sublist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/album/sublist";
    let query_string = QueryParams::from(options.params);
    let query_params = json_object!({
        "limit": query_string.value("limit").unwrap_or("25"),
        "offset": query_string.value("offset").unwrap_or("0"),
        "total": "true"
    });
    let cookie = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookie)
}

// #[get("/album")]
pub(crate) fn index_album(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/v1/album/{}",
        query_string.value("id").unwrap_or("0")
    );
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/artist/album")]
pub(crate) fn index_artist_album(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/artist/albums/{}",
        query_string.value("id").unwrap_or("0")
    );

    let cookies = get_cookie_string(options.cookie);
    let query_params = json_object!({
        "limit": query_string.value("limit").unwrap_or("30"),
        "offset": query_string.value("offset").unwrap_or("0"),
        "total": "true"
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/artist/desc")]
pub(crate) fn index_artist_desc(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/artist/introduction";
    let query_string = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query_string.value("id").unwrap()
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// 歌手分类
/*
    categoryCode 取值
    入驻歌手 5001
    华语男歌手 1001
    华语女歌手 1002
    华语组合/乐队 1003
    欧美男歌手 2001
    欧美女歌手 2002
    欧美组合/乐队 2003
    日本男歌手 6001
    日本女歌手 6002
    日本组合/乐队 6003
    韩国男歌手 7001
    韩国女歌手 7002
    韩国组合/乐队 7003
    其他男歌手 4001
    其他女歌手 4002
    其他组合/乐队 4003
    initial 取值 a-z/A-Z
*/

// #[get("/artist/list")]
pub(crate) fn index_artist_list(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/artist/list";
    let query_string = QueryParams::from(options.params);
    let query_params = json_object!({
        "categoryCode": query_string.value("cat").unwrap_or("1001"),
        "initial": "undefined",
        "offset": query_string.value("offset").unwrap_or("0"),
        "total": "true"
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/artist/mv")]
pub(crate) fn index_artist_mv(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/artist/mvs";
    let query_string = QueryParams::from(options.params);

    let query_params = json_object!({
        "artistId": query_string.value("id").unwrap(),
        "limit": query_string.value("limit").unwrap_or("25"),
        "offset": query_string.value("offset").unwrap_or("0"),
        "total": "true"
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/artist/sub")]
pub(crate) fn index_artist_sub(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let sub = query_string
        .value("t")
        .unwrap_or("0")
        .parse::<i32>()
        .unwrap();
    let url = &format!(
        "https://music.163.com/weapi/artist/{}",
        if sub == 1 { "sub" } else { "unsub" }
    );

    let ids = "[".to_owned() + query_string.value("id").unwrap() + "]";
    let query_params = json_object!({
        "artistId": query_string.value("id").unwrap(),
        "artistIds": &ids,
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/artist/sublist")]
pub(crate) fn index_artist_sublist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/artist/sublist";
    let query_string = QueryParams::from(options.params);

    let query_params = json_object!({
        "limit": query_string.value("cat").unwrap_or("25"),
        "offset": query_string.value("offset").unwrap_or("0"),
        "total": "true"
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/artist/top/song")]
pub(crate) fn index_artist_top_song(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/artist/top/song";
    let query_string = QueryParams::from(options.params);

    let query_params = json_object!({
        "id": query_string.value("id").unwrap()
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/artists")]
pub(crate) fn index_artists(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/v1/artist/{}",
        query_string.value("id").unwrap()
    );
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/banner")]
pub(crate) fn index_banner(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = "https://music.163.com/api/v2/banner/get";
    let type_arr = ["pc", "android", "iphone", "ipad"];
    let query_params = json_object!({
        "clientType": type_arr[query_string.value("type").unwrap_or("0").parse::<usize>().unwrap()]
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "linuxapi", query_params, &cookies)
}

// #[get("/check/music")]
pub(crate) fn index_check_music(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/song/enhance/player/url";

    let query_string = QueryParams::from(options.params);
    let ids = "[".to_owned() + query_string.value("id").unwrap() + "]";
    let query_params = json_object!({
        "ids": query_string.value("id").unwrap(),
        "br": query_string.value("br").unwrap_or("999000"),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

fn comment_common(url: &str, query_string: QueryParams<'_>, cookie: &str) -> FormatParams {
    let query_params = json_object!({
        "rid": query_string.value("id").unwrap(),
        "limit": query_string.value("limit").unwrap_or("20"),
        "offset": query_string.value("offset").unwrap_or("0"),
        "beforeTime": query_string.value("before").unwrap_or("0"),
    });

    let cookies = get_cookie_string(cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/comment/album")]
pub(crate) fn index_comment_album(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/v1/resource/comments/R_AL_3_{}",
        query_string.value("id").unwrap()
    );
    comment_common(url, query_string, options.cookie)
}

// #[get("/comment/dj")]
pub(crate) fn index_comment_dj(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/v1/resource/comments/A_DJ_1_{}",
        query_string.value("id").unwrap()
    );
    comment_common(url, query_string, options.cookie)
}

// #[get("/comment/event")]
pub(crate) fn index_comment_event(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/v1/resource/comments/{}",
        query_string.value("threadId").unwrap()
    );
    let query_params = json_object!({
        "limit": query_string.value("limit").unwrap_or("20"),
        "offset": query_string.value("offset").unwrap_or("0"),
        "beforeTime": query_string.value("before").unwrap_or("0"),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/comment/hot")]
pub(crate) fn index_comment_hot(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let _type: &str = [
        "R_SO_4_", "R_MV_5_", "A_PL_0_", "R_AL_3_", "A_DJ_1_", "R_VI_62_",
    ][query_string
        .value("type")
        .unwrap_or("0")
        .parse::<usize>()
        .unwrap()];
    let url = &format!(
        "https://music.163.com/weapi/v1/resource/hotcomments/{}{}",
        _type,
        query_string.value("id").unwrap()
    );
    comment_common(url, query_string, options.cookie)
}

// #[get("/comment/hotwall/list")]
pub(crate) fn index_comment_hotwall_list(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/comment/hotwall/list/get";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/comment/like")]
pub(crate) fn index_comment_like(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let like = if query_string.value("t").unwrap_or("0") == "1" {
        "like"
    } else {
        "unlike"
    };
    let url = &format!("https://music.163.com/weapi/v1/comment/{}", like);
    let _type: &str = [
        "R_SO_4_", "R_MV_5_", "A_PL_0_", "R_AL_3_", "A_DJ_1_", "R_VI_62_", "A_EV_2_",
    ][query_string
        .value("type")
        .unwrap_or("0")
        .parse::<usize>()
        .unwrap()];
    let thread_id = _type.to_owned() + query_string.value("id").unwrap();
    let query_params = json_object!({
        "commentId": query_string.value("cid").unwrap(),
        "threadId": &thread_id,
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/comment/music")]
pub(crate) fn index_comment_music(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/api/v1/resource/comments/R_SO_4_{}",
        query_string.value("id").unwrap()
    );
    comment_common(url, query_string, options.cookie)
}

// #[get("/comment/mv")]
pub(crate) fn index_comment_mv(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/v1/resource/comments/R_MV_5_{}",
        query_string.value("id").unwrap()
    );
    comment_common(url, query_string, options.cookie)
}

// #[get("/comment/playlist")]
pub(crate) fn index_comment_playlist(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/v1/resource/comments/A_PL_0_{}",
        query_string.value("id").unwrap()
    );
    comment_common(url, query_string, options.cookie)
}

// #[get("/comment")]
pub(crate) fn index_comment(options: Options) -> FormatParams {
    let query_string = QueryParams::from(options.params);
    let _t = ["add", "delete", "reply"][query_string
        .value("t")
        .unwrap_or("0")
        .parse::<usize>()
        .unwrap()];

    let url = &format!("https://music.163.com/weapi/resource/comments/{}", _t);

    let _type: &str = [
        "R_SO_4_", "R_MV_5_", "A_PL_0_", "R_AL_3_", "A_DJ_1_", "R_VI_62_", "A_EV_2_",
    ][query_string
        .value("type")
        .unwrap_or("0")
        .parse::<usize>()
        .unwrap()];

    let mut query_params = json_object!({});
    let _td = _type.to_owned() + query_string.value("id").unwrap();
    if _type == "A_EV_2_" {
        query_params.insert("threadId", query_string.value("threadId").unwrap());
    } else {
        query_params.insert("threadId", &_td);
    };
    if _t == "add" {
        query_params.insert("content", query_string.value("content").unwrap());
    } else if _t == "delete" {
        query_params.insert("commentId", query_string.value("commentId").unwrap());
    } else if _t == "reply" {
        query_params.insert("commentId", query_string.value("commentId").unwrap());
        query_params.insert("content", query_string.value("content").unwrap());
    };

    let cookies = get_cookie_string(options.cookie) + ";os=pc;";
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/daily_signin")]
pub(crate) fn index_daily_sigin(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/point/dailyTask";

    let query_string = QueryParams::from(options.params);
    let query_params = json_object!({
        "type": query_string.value("type").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    let request_params = json_object!({
        "crypto": "weapi",
        "cookie": &cookies,
        "proxy": ""
    });

    generate_response(url, "POST", query_params, request_params)
}

// #[get("/digitalAlbum/purchased")]
pub(crate) fn index_digitalAlbum_purchased(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/digitalAlbum/purchased";

    let query_string = QueryParams::from(options.params);
    let query_params = json_object!({
        "limit": query_string.value("limit").unwrap_or("30"),
        "offset": query_string.value("offset").unwrap_or("0"),
        "total": "true"
    });
    let cookies = get_cookie_string(options.cookie);
    let request_params = json_object!({
        "crypto": "weapi",
        "cookie": &cookies,
        "proxy": ""
    });

    generate_response(url, "POST", query_params, request_params)
}

// #[get("/dj/banner")]
pub(crate) fn index_dj_banner(options: Options) -> FormatParams {
    let url = "http://music.163.com/weapi/djradio/banner/get";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/dj/category/excludehot")]
pub(crate) fn index_dj_category_excludehot(options: Options) -> FormatParams {
    let url = "http://music.163.com/weapi/djradio/category/excludehot";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/dj/category/recommend")]
pub(crate) fn index_dj_category_recommend(options: Options) -> FormatParams {
    let url = "http://music.163.com/weapi/djradio/home/category/recommend";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/dj/catelist")]
pub(crate) fn index_dj_catelist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/djradio/category/get";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/dj/detail")]
pub(crate) fn index_dj_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/djradio/get";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "id": query.value("rid").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/hot")]
pub(crate) fn index_dj_hot(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/djradio/hot/v1";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/paygift")]
pub(crate) fn index_dj_paygift(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/djradio/home/paygift/list?_nmclfl=1";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/program/detail")]
pub(crate) fn index_dj_program_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/dj/program/detail";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "id": query.value("id").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/program/toplist/hours")]
pub(crate) fn index_dj_program_toplist_hours(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/djprogram/toplist/hours";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("30"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/program/toplist")]
pub(crate) fn index_dj_program_toplist(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/program/toplist/v1";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("100"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/program")]
pub(crate) fn index_dj_program(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/dj/program/byradio";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "radioId": query.value("rid").unwrap(),
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
        "asc": query.value("asc").unwrap_or("false")
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/radio/hot")]
pub(crate) fn index_dj_radio_hot(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/djradio/hot";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "cateId": query.value("cateId").unwrap(),
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// 精选电台分类
/*
    有声书 10001
    知识技能 453050
    商业财经 453051
    人文历史 11
    外语世界 13
    亲子宝贝 14
    创作|翻唱 2001
    音乐故事 2
    3D|电子 10002
    相声曲艺 8
    情感调频 3
    美文读物 6
    脱口秀 5
    广播剧 7
    二次元 3001
    明星做主播 1
    娱乐|影视 4
    科技科学 453052
    校园|教育 4001
    旅途|城市 12
*/

// #[get("/dj/recommend/type")]
pub(crate) fn index_dj_recommend_type(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/djradio/recommend";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "cateId": query.value("type").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/recommend")]
pub(crate) fn index_dj_recommend(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/djradio/recommend/v1";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/dj/sub")]
pub(crate) fn index_dj_sub(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let sub = if query.value("t").unwrap_or("0") == "1" {
        "sub"
    } else {
        "unsub"
    };
    let url = &format!("https://music.163.com/weapi/djradio/{}", sub);
    let _params = json_object!({
        "id": query.value("rid").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/sublist")]
pub(crate) fn index_dj_sublist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/djradio/get/subed";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
        "total": "true"
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/today/perfered")]
pub(crate) fn index_dj_today_perfered(options: Options) -> FormatParams {
    let url = "http://music.163.com/weapi/djradio/home/today/perfered";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "page": query.value("page").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/toplist/hours")]
pub(crate) fn index_dj_toplist_hours(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/dj/toplist/hours";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("100"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/toplist/newcomer")]
pub(crate) fn index_dj_toplist_newcomer(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/dj/toplist/newcomer";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("100"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/toplist/pay")]
pub(crate) fn index_dj_toplist_pay(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/djradio/toplist/pay";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("100"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/toplist/popular")]
pub(crate) fn index_dj_toplist_popular(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/dj/toplist/popular";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("100"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/dj/toplist")]
pub(crate) fn index_dj_toplist(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/djradio/toplist";
    let query = QueryParams::from(options.params);
    let _type = if query.value("type").unwrap_or("new") == "new" {
        "0"
    } else {
        "1"
    };
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("0"),
        "offset": query.value("offset").unwrap_or("0"),
        "type": _type
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/event/del")]
pub(crate) fn index_event_del(options: Options) -> FormatParams {
    let url = "https://music.163.com/eapi/event/delete";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "id": query.value("evId").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/event/forward")]
pub(crate) fn index_event_forward(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/event/forward";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "id": query.value("evId").unwrap(),
        "forwards": query.value("forwards").unwrap(),
        "eventUserId": query.value("uid").unwrap()
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/event")]
pub(crate) fn index_event(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/event/get";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "pagesize": query.value("pagesize").unwrap_or("20"),
        "lasttime": query.value("lasttime").unwrap_or("-1"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/fm/trash")]
pub(crate) fn index_fm_trash(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/radio/trash/add?alg=RT&songId={}&time={}",
        query.value("id").unwrap(),
        query.value("time").unwrap_or("25")
    );
    let _params = json_object!({
        "songId": query.value("id").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/follow")]
pub(crate) fn index_follow(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let _t = if query.value("t").unwrap_or("0") == "1" {
        "follow"
    } else {
        "delfollow"
    };
    let url = &format!(
        "https://music.163.com/weapi/user/{}/{}",
        _t,
        query.value("id").unwrap()
    );
    let _params = json_object!({});
    let cookies = get_cookie_string(options.cookie) + ";os=pc;";
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/hot/topic")]
pub(crate) fn index_hot_topic(options: Options) -> FormatParams {
    let url = "http://music.163.com/weapi/act/hot";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "limit": query.value("limit").unwrap_or("20"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/like")]
pub(crate) fn index_like(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/radio/like?alg={}&trackId={}&time={}",
        query.value("alg").unwrap_or("itembased"),
        query.value("id").unwrap(),
        query.value("time").unwrap_or("25")
    );
    let _params = json_object!({
        "trackId": query.value("id").unwrap(),
        "like": query.value("like").unwrap_or("false")
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/likelist")]
pub(crate) fn index_likelist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/song/like/get";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "uid": query.value("uid").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/login/cellphone")]
pub(crate) fn index_login_cellphone(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/login/cellphone";
    let query_string = QueryParams::from(options.params);
    let pw = Crypto::hash_encrypt(
        query_string.value("password").unwrap(),
        HashType::md5,
        hex::encode,
    );
    let query_params = json_object!({
        "phone": query_string.value("phone").unwrap(),
        "countrycode": query_string.value("countrycode").unwrap_or("86"),
        "password": &pw,
        "rememberLogin": "true",
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/login/qr/key")]
pub(crate) fn index_login_qr_key(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/login/qrcode/unikey";
    let query_params = json_object!({
        "type": "1",
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/login/qr/create")]
pub(crate) fn index_login_qr_create(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let codekey = query.value("key").unwrap();
    let url = &format!("https://music.163.com/login?codekey={}",codekey);
    let _params = json_object!({});
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/login/qr/check")]
pub(crate) fn index_login_qr_check(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/login/qrcode/client/login";
    let query = QueryParams::from(options.params);
    let _params = json_object!({
        "type": "1",
        "key": query.value("key").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/login/status")]
pub(crate) fn index_login_status(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/w/nuser/account/get";
    let _params = json_object!({});
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", _params, &cookies)
}

// #[get("/login/refresh")]
pub(crate) fn index_login_refresh(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/login/token/refresh";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/logout")]
pub(crate) fn index_logout(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/logout";
    let query_params = json_object!({});
    let cookies = get_cookie_string(options.cookie);
    let request_params = json_object!({
        "crypto": "weapi",
        "ua": "pc",
        "cookie": &cookies,
        "proxy": ""
    });
    generate_response(url, "POST", query_params, request_params)
}

// #[get("/lyric")]
pub(crate) fn index_lyric(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/song/lyric?lv=-1&kv=-1&tv=-1";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("id").unwrap()
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "linuxapi", query_params, &cookies)
}

// #[get("/msg/comments")]
pub(crate) fn index_msg_comments(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/api/v1/user/comments/{}",
        query.value("uid").unwrap()
    );
    let query_params = json_object!({
        "beforeTime": query.value("before").unwrap_or("-1"),
        "limit": query.value("limit").unwrap_or("30"),
        "total": "true",
        "uid": query.value("uid").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/msg/forwards")]
pub(crate) fn index_msg_forwards(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/forwards/get";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "offset": query.value("offset").unwrap_or("0"),
        "limit": query.value("limit").unwrap_or("30"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/msg/notices")]
pub(crate) fn index_msg_notices(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/msg/notices";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "offset": query.value("offset").unwrap_or("0"),
        "limit": query.value("limit").unwrap_or("30"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/msg/private/history")]
pub(crate) fn index_msg_private_history(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/msg/private/history";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "userId": query.value("uid").unwrap(),
        "limit": query.value("limit").unwrap_or("30"),
        "time": query.value("before").unwrap_or("0"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/msg/private")]
pub(crate) fn index_msg_private(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/msg/private/users";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "offset": query.value("offset").unwrap_or("0"),
        "limit": query.value("limit").unwrap_or("30"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/mv/all")]
pub(crate) fn index_mv_all(options: Options) -> FormatParams {
    let url = "https://interface.music.163.com/api/mv/all";
    let query = QueryParams::from(options.params);
    let tags = &format!(
        "地区:{};类型:{};排序:{}",
        query.value("area").unwrap_or("全部"),
        query.value("type").unwrap_or("全部"),
        query.value("order").unwrap_or("上升最快"),
    );
    let query_params = json_object!({
        "offset": query.value("offset").unwrap_or("0"),
        "limit": query.value("limit").unwrap_or("30"),
        "tags": tags,
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/mv/detail")]
pub(crate) fn index_mv_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/mv/detail";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("mvid").unwrap()
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/mv/exclusive/rcmd")]
pub(crate) fn index_mv_exclusive_rcmd(options: Options) -> FormatParams {
    let url = "https://interface.music.163.com/api/mv/exclusive/rcmd";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "offset": query.value("offset").unwrap_or("0"),
        "limit": query.value("limit").unwrap_or("30")
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/mv/first")]
pub(crate) fn index_mv_first(options: Options) -> FormatParams {
    let url = "https://interface.music.163.com/weapi/mv/first";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "area": query.value("area").unwrap_or(""),
        "limit": query.value("limit").unwrap_or("30"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/mv/sub")]
pub(crate) fn index_mv_sub(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let _t = if query.value("t").unwrap_or("0") == "1" {
        "sub"
    } else {
        "unsub"
    };
    let url = &format!("https://music.163.com/weapi/mv/{}", _t);
    let mv_ids = r#"[""#.to_owned() + query.value("mvid").unwrap() + r#""]"#;
    let query_params = json_object!({
        "mvId": query.value("mvId").unwrap(),
        "mvIds": &mv_ids,
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/mv/sublist")]
pub(crate) fn index_mv_sublist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/cloudvideo/allvideo/sublist";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "limit": query.value("limit").unwrap_or("25"),
        "offset": query.value("offset").unwrap_or("0"),
        "total": "true"
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/mv/url")]
pub(crate) fn index_mv_url(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/song/enhance/play/mv/url";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
        "r": query.value("res").unwrap_or("1080"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/personal/fm")]
pub(crate) fn index_personal_fm(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/radio/get";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/personalized/djprogram")]
pub(crate) fn index_personalized_djprogram(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/personalized/djprogram";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/personalized/mv")]
pub(crate) fn index_personalized_mv(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/personalized/mv";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/personalized/newsong")]
pub(crate) fn index_personalized_newsong(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/personalized/newsong";
    let query_params = json_object!({
        "type": "recommend",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/personalized/privatecontent")]
pub(crate) fn index_personalized_privatecontent(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/personalized/privatecontent";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/personalized")]
pub(crate) fn index_personalized(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/personalized/playlist";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "limit": query.value("limit").unwrap_or("30"),
        "total": "true",
        "n": "1000",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/playlist/catlist")]
pub(crate) fn index_playlist_catlist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/playlist/catalogue";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/playlist/create")]
pub(crate) fn index_playlist_create(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/playlist/create";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "name": query.value("name").unwrap(),
        "privacy": query.value("privacy").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie) + ";os=pc;";
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/playlist/delete")]
pub(crate) fn index_playlist_delete(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/playlist/delete";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "pid": query.value("id").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie) + ";os=pc;";
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/playlist/desc_update")]
pub(crate) fn index_playlist_desc_update(options: Options) -> FormatParams {
    let url = "http://interface3.music.163.com/eapi/playlist/desc/update";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "pid": query.value("id").unwrap(),
        "desc": query.value("desc").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie) + ";os=pc;";
    let request_params = json_object!({
        "crypto": "eapi",
        "cookie": &cookies,
        "proxy": "",
        "url": "/api/playlist/desc/update",
    });
    generate_response(url, "POST", query_params, request_params)
}

// #[get("/playlist/detail")]
pub(crate) fn index_playlist_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v3/playlist/detail";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
        "n": "100000",
        "s": query.value("s").unwrap_or("8"),
    });
    let cookies = get_cookie_string(options.cookie) + ";os=pc;";
    request_handler(url, "linuxapi", query_params, &cookies)
}

// #[get("/playlist/hot")]
pub(crate) fn index_playlist_hot(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/playlist/hottags";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/playlist/name/update")]
pub(crate) fn index_playlist_name_update(options: Options) -> FormatParams {
    let url = "http://interface3.music.163.com/eapi/playlist/update/name";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
        "name": query.value("name").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie) + ";os=pc;";
    let request_params = json_object!({
        "crypto": "eapi",
        "cookie": &cookies,
        "proxy": "",
        "url": "/api/playlist/update/name",
    });
    generate_response(url, "POST", query_params, request_params)
}

// #[get("/playlist/subscribe")]
pub(crate) fn index_playlist_subscribe(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let _t = if query.value("t").unwrap_or("0") == "1" {
        "subscribe"
    } else {
        "unsubscribe"
    };
    let url = &format!("https://music.163.com/weapi/playlist/{}", _t);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/playlist/subscribers")]
pub(crate) fn index_playlist_subscribers(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/playlist/subscribers";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
        "limit": query.value("limit").unwrap_or("20"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/playlist/tags/update")]
pub(crate) fn index_playlist_tags_update(options: Options) -> FormatParams {
    let url = "http://interface3.music.163.com/eapi/playlist/tags/update";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
        "tags": query.value("tags").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    let request_params = json_object!({
        "crypto": "eapi",
        "cookie": &cookies,
        "proxy": "",
        "url": "/api/playlist/tags/update",
    });
    generate_response(url, "POST", query_params, request_params)
}

// #[get("/playlist/tracks")]
pub(crate) fn index_playlist_tracks(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/playlist/manipulate/tracks";
    let query = QueryParams::from(options.params);
    let ids = "[".to_owned() + query.value("trakcs").unwrap() + "]";
    let query_params = json_object!({
        "op": query.value("op").unwrap(),
        "pid": query.value("pid").unwrap_or("20"),
        "tackIds": &ids,
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/playlist/update")]
pub(crate) fn index_playlist_update(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/batch";
    let query = QueryParams::from(options.params);
    let _id = query.value("id").unwrap();
    let _desc = format!(
        r#"{{"id":{},"desc":"{}"}}"#,
        _id,
        query.value("desc").unwrap_or(""),
    );
    let _tags = format!(
        r#"{{"id":{},"tags":"{}"}}"#,
        _id,
        query.value("tags").unwrap_or(""),
    );
    let _name = format!(
        r#"{{"id":{},"name":"{}"}}"#,
        _id,
        query.value("name").unwrap_or("")
    );
    let query_params = json_object!({
        "/api/playlist/desc/update": &_desc[..],
        "/api/playlist/tags/update": &_tags[..],
        "/api/playlist/update/name": &_name[..],
    });
    let cookies = get_cookie_string(options.cookie) + "os=pc;";
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/playmode/intelligence/list")]
pub(crate) fn index_playmode_intelligence_list(options: Options) -> FormatParams {
    let url = "http://music.163.com/weapi/playmode/intelligence/list";
    let query = QueryParams::from(options.params);
    let ids = "[".to_owned() + query.value("trakcs").unwrap() + "]";
    let query_params = json_object!({
        "songId": query.value("id").unwrap(),
        "type": "fromPlayOne",
        "playlistId": query.value("pid").unwrap(),
        "startMusicId": query.value("sid").unwrap_or(query.value("id").unwrap()),
        "count": query.value("count").unwrap_or("1"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/program/recommend")]
pub(crate) fn index_program_recommend(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/program/recommend/v1";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "cateId": query.value("type").unwrap(),
        "limit": query.value("limit").unwrap_or("10"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/rebind")]
pub(crate) fn index_rebind(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/user/replaceCellphone";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "captcha": query.value("captcha").unwrap(),
        "phone": query.value("phone").unwrap(),
        "oldcaptcha": query.value("oldcaptcha").unwrap(),
        "ctcode": query.value("ctcode").unwrap_or("86"),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/recommend/resource")]
pub(crate) fn index_recommend_resource(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/discovery/recommend/resource";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/recommend/songs")]
pub(crate) fn index_recommend_songs(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/discovery/recommend/songs";
    let query_params = json_object!({
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/register/cellphone")]
pub(crate) fn index_register_cellphone(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/register/cellphone";
    let query = QueryParams::from(options.params);
    let pw = Crypto::hash_encrypt(query.value("password").unwrap(), HashType::md5, hex::encode);
    let query_params = json_object!({
        "captcha": query.value("captcha").unwrap(),
        "phone": query.value("phone").unwrap(),
        "password": &pw,
        "nickname": query.value("nickname").unwrap(),
    });

    let cookies = get_cookie_string(options.cookie) + "os=pc;";
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/related/allvideo")]
pub(crate) fn index_related_allvideo(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/cloudvideo/v1/allvideo/rcmd";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
        "type": "1",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/related/playlist")]
pub(crate) fn index_related_playlist(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/playlist?id={}",
        query.value("id").unwrap()
    );
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/resource/like")]
pub(crate) fn index_resource_like(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let _t = if query.value("t").unwrap_or("0") == "1" {
        "like"
    } else {
        "unlike"
    };
    let url = &format!("https://music.163.com/weapi/resource/{}", _t);

    let _type = ["", "R_MV_5_", "", "", "A_DJ_1_", "R_VI_62_", "A_EV_2_"]
        [query.value("type").unwrap_or("0").parse::<usize>().unwrap()];
    let _id = _type.to_owned() + query.value("id").unwrap();
    let query_params = json_object!({
        "threadId": &_id[..]
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/search/default")]
pub(crate) fn index_search_default(options: Options) -> FormatParams {
    let url = "http://interface3.music.163.com/eapi/search/defaultkeyword/get";
    let query_params = json_object!({});
    let cookies = get_cookie_string(options.cookie);
    let request_params = json_object!({
        "crypto": "eapi",
        "cookie": &cookies,
        "proxy": "",
        "url": "/api/search/defaultkeyword/get",
    });

    generate_response(url, "POST", query_params, request_params)
}

// #[get("/search/hot/detail")]
pub(crate) fn index_search_hot_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/hotsearchlist/get";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/search/hot")]
pub(crate) fn index_search_hot(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/search/hot";
    let query_params = json_object!({
        "type": "1111",
    });
    let cookies = get_cookie_string(options.cookie);
    let request_params = json_object!({
        "crypto": "weapi",
        "ua": "mobile",
        "cookie": &cookies,
        "proxy": ""
    });

    generate_response(url, "POST", query_params, request_params)
}

// #[get("/search/multimatch")]
pub(crate) fn index_search_multimatch(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/search/suggest/multimatch";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "type": query.value("type").unwrap_or("1"),
        "s": query.value("keywords").unwrap_or(""),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/search/suggest")]
pub(crate) fn index_search_suggest(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let _type = if query.value("type").unwrap_or("mobile") == "mobile" {
        "keyword"
    } else {
        "web"
    };
    let url = &format!("https://music.163.com/weapi/search/suggest/{}", _type);
    let query_params = json_object!({
        "s": query.value("keywords").unwrap_or(""),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/search")]
pub(crate) fn index_search(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/search/get";

    let query_string = QueryParams::from(options.params);
    let query_params = json_object!({
        "s": query_string.value("keywords").unwrap_or(""),
        "type": query_string.value("type").unwrap_or("1"),
        "limit": query_string.value("limit").unwrap_or("30"),
        "offset": query_string.value("offset").unwrap_or("0")
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/send/playlist")]
pub(crate) fn index_send_playlist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/msg/private/send";
    let query = QueryParams::from(options.params);
    let _ids = "[".to_owned() + query.value("user_ids").unwrap() + "]";
    let query_params = json_object!({
        "id": query.value("playlist").unwrap(),
        "type": "playlist",
        "msg": query.value("msg").unwrap_or(""),
        "userIds": &_ids,
    });

    let cookies = get_cookie_string(options.cookie) + "os=pc;";
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/send/text")]
pub(crate) fn index_send_text(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/msg/private/send";
    let query = QueryParams::from(options.params);
    let _ids = "[".to_owned() + query.value("user_ids").unwrap() + "]";
    let query_params = json_object!({
        "id": query.value("playlist").unwrap(),
        "type": "text",
        "msg": query.value("msg").unwrap_or(""),
        "userIds": &_ids,
    });

    let cookies = get_cookie_string(options.cookie) + "os=pc;";
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/setting")]
pub(crate) fn index_setting(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/user/setting";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/share/resource")]
pub(crate) fn index_share_resource(options: Options) -> FormatParams {
    let url = "http://music.163.com/weapi/share/friends/resource";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "type": query.value("type").unwrap_or("song"),
        "msg": query.value("msg").unwrap_or(""),
        "id": query.value("id").unwrap_or(""),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/simi/artist")]
pub(crate) fn index_simi_artist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/discovery/simiArtist";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "artistid": query.value("id").unwrap(),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/simi/mv")]
pub(crate) fn index_simi_mv(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/discovery/simiMV";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "mvid": query.value("mvid").unwrap(),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/simi/playlist")]
pub(crate) fn index_simi_playlist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/discovery/simiPlaylist";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "songid": query.value("id").unwrap(),
        "limit": query.value("limit").unwrap_or("50"),
        "offset": query.value("offset").unwrap_or("0"),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/simi/song")]
pub(crate) fn index_simi_song(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/discovery/simiSong";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "songid": query.value("id").unwrap(),
        "limit": query.value("limit").unwrap_or("51"),
        "offset": query.value("offset").unwrap_or("0"),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/simi/user")]
pub(crate) fn index_simi_user(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/discovery/simiUser";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "songid": query.value("id").unwrap(),
        "limit": query.value("limit").unwrap_or("52"),
        "offset": query.value("offset").unwrap_or("0"),
    });

    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/song/detail")]
pub(crate) fn index_song_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v3/song/detail";
    let query = QueryParams::from(options.params);
    let c = &format!(r#""[{{"id":{}}}]""#, query.value("ids").unwrap());
    let ids = &format!(r#""[{}]""#, query.value("ids").unwrap());
    let query_params = json_object!({
        "c": &c[..],
        "ids": &ids[..],
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/song/url")]
pub(crate) fn index_song_url(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/song/enhance/player/url";
    let query = QueryParams::from(options.params);

    let ids = "[".to_owned() + query.value("id").unwrap() + "]";
    let query_params = json_object!({
        "ids": ids.as_str(),
        "br": query.value("br").unwrap_or("999000")
    });

    let cookies = get_cookie_string(options.cookie) + ";os=pc;";
    request_handler(url, "linuxapi", query_params, &cookies)
}

// #[get("/top/album")]
pub(crate) fn index_top_album(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/album/new";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "area": query.value("type").unwrap_or("ALL"),
        "limit": query.value("limit").unwrap_or("50"),
        "offset": query.value("offset").unwrap_or("0"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/top/artist")]
pub(crate) fn index_top_artist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/artist/top";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "limit": query.value("limit").unwrap_or("50"),
        "offset": query.value("offset").unwrap_or("0"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/top/list")]
pub(crate) fn index_top_list(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v3/playlist/detail";
    let query = QueryParams::from(options.params);
    static top_list: [&str; 37] = [
        "3779629",    //云音乐新歌榜
        "3778678",    //云音乐热歌榜
        "2884035",    //云音乐原创榜
        "19723756",   //云音乐飙升榜
        "10520166",   //云音乐电音榜
        "180106",     //UK排行榜周榜
        "60198",      //美国Billboard周榜
        "21845217",   //KTV嗨榜
        "11641012",   //iTunes榜
        "120001",     //Hit FM Top榜
        "60131",      //日本Oricon周榜
        "3733003",    //韩国Melon排行榜周榜
        "60255",      //韩国Mnet排行榜周榜
        "46772709",   //韩国Melon原声周榜
        "112504",     //中国TOP排行榜(港台榜)
        "64016",      //中国TOP排行榜(内地榜)
        "10169002",   //香港电台中文歌曲龙虎榜
        "4395559",    //华语金曲榜
        "1899724",    //中国嘻哈榜
        "27135204",   //法国 NRJ EuroHot 30周榜
        "112463",     //台湾Hito排行榜
        "3812895",    //Beatport全球电子舞曲榜
        "71385702",   //云音乐ACG音乐榜
        "991319590",  //云音乐说唱榜,
        "71384707",   //云音乐古典音乐榜
        "1978921795", //云音乐电音榜
        "2250011882", //抖音排行榜
        "2617766278", //新声榜
        "745956260",  //云音乐韩语榜
        "2023401535", //英国Q杂志中文版周榜
        "2006508653", //电竞音乐榜
        "2809513713", //云音乐欧美热歌榜
        "2809577409", //云音乐欧美新歌榜
        "2847251561", //说唱TOP榜
        "3001835560", //云音乐ACG动画榜
        "3001795926", //云音乐ACG游戏榜
        "3001890046", //云音乐ACG VOCALOID榜
    ];
    let query_params = json_object!({
        "id": top_list[query.value("idx").unwrap_or("0").parse::<usize>().unwrap()],
        "n": "10000",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "linuxapi", query_params, &cookies)
}

// #[get("/top/mv")]
pub(crate) fn index_top_mv(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/mv/toplist";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "area": query.value("area").unwrap_or(""),
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/top/playlist/highquality")]
pub(crate) fn index_top_playlist_highquality(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/playlist/highquality/list";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "cat": query.value("cat").unwrap_or("全部"),
        "limit": query.value("limit").unwrap_or("30"),
        "lasttime": query.value("before").unwrap_or("0"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/top/playlist")]
pub(crate) fn index_top_playlist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/playlist/list";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "cat": query.value("cat").unwrap_or("全部"),
        "order": query.value("order").unwrap_or("hot"),
        "limit": query.value("limit").unwrap_or("30"),
        "lasttime": query.value("before").unwrap_or("0"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/top/song")]
pub(crate) fn index_top_song(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/discovery/new/songs";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "areaId": query.value("type").unwrap_or("0"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/toplist/artist")]
pub(crate) fn index_toplist_artist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/toplist/artist";
    let query_params = json_object!({
        "type": "1",
        "limit": "100",
        "offset": "0",
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/toplist/detail")]
pub(crate) fn index_toplist_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/toplist/detail";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/toplist")]
pub(crate) fn index_toplist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/toplist";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/user/audio")]
pub(crate) fn index_user_audio(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/djradio/get/byuser";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "userId": query.value("uid").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/cloud/del")]
pub(crate) fn index_user_cloud_del(options: Options) -> FormatParams {
    let url = "http://music.163.com/weapi/cloud/del";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "songIds": query.value("id").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/cloud/detail")]
pub(crate) fn index_user_cloud_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/cloud/get/byids";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "songIds": query.value("id").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/cloud")]
pub(crate) fn index_user_cloud(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/cloud/get";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/detail")]
pub(crate) fn index_user_detail(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/v1/user/detail/{}",
        query.value("uid").unwrap()
    );
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/user/dj")]
pub(crate) fn index_user_dj(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/dj/program/{}",
        query.value("uid").unwrap()
    );
    let query_params = json_object!({
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/event")]
pub(crate) fn index_user_event(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/event/get/{}",
        query.value("uid").unwrap()
    );
    let query_params = json_object!({
        "getcounts": "true",
        "time": query.value("lasttime").unwrap_or("-1"),
        "limit": query.value("limit").unwrap_or("30"),
        "total": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/followeds")]
pub(crate) fn index_user_followeds(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/eapi/user/getfolloweds/{}",
        query.value("uid").unwrap()
    );
    let query_params = json_object!({
        "userId": query.value("uid").unwrap(),
        "time": query.value("lasttime").unwrap_or("-1"),
        "limit": query.value("limit").unwrap_or("30"),
    });
    let cookies = get_cookie_string(options.cookie);
    let request_params = json_object!({
        "crypto": "eapi",
        "cookie": &cookies,
        "proxy": "",
        "url": "/api/user/getfolloweds",
    });

    generate_response(url, "POST", query_params, request_params)
}

// #[get("/user/follows")]
pub(crate) fn index_user_follows(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = &format!(
        "https://music.163.com/weapi/user/getfollows/{}",
        query.value("uid").unwrap()
    );
    let query_params = json_object!({
        "offset": query.value("offset").unwrap_or("0"),
        "limit": query.value("limit").unwrap_or("30"),
        "order": "true",
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/playlist")]
pub(crate) fn index_user_playlist(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/user/playlist";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "uid": query.value("uid").unwrap(),
        "limit": query.value("limit").unwrap_or("30"),
        "offset": query.value("offset").unwrap_or("0"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/record")]
pub(crate) fn index_user_record(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/v1/play/record";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "uid": query.value("uid").unwrap(),
        "type": query.value("type").unwrap_or("1"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/user/account")]
pub(crate) fn index_user_account(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/nuser/account/get";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/user/subcount")]
pub(crate) fn index_user_subcount(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/subcount";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/user/update")]
pub(crate) fn index_user_update(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/user/profile/update";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "avatarImgId": "0",
        "birthday": query.value("birthday").unwrap(),
        "city": query.value("city").unwrap(),
        "gender": query.value("gender").unwrap(),
        "nickname": query.value("nickname").unwrap(),
        "province": query.value("province").unwrap(),
        "signature": query.value("signature").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/video/detail")]
pub(crate) fn index_video_detail(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/cloudvideo/v1/video/detail";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/video/group/list")]
pub(crate) fn index_video_group_list(options: Options) -> FormatParams {
    let url = "https://music.163.com/api/cloudvideo/group/list";
    empty_query_params_handler(url, "weapi", options.cookie)
}

// #[get("/video/group")]
pub(crate) fn index_video_group(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/videotimeline/videogroup/get";
    let query = QueryParams::from(options.params);
    let query_params = json_object!({
        "groupId": query.value("id").unwrap(),
        "offset": query.value("offset").unwrap_or("0"),
        "needUrl": "true",
        "resolution": query.value("res").unwrap_or("1080"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/video/sub")]
pub(crate) fn index_video_sub(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let _t = if query.value("t").unwrap_or("0") == "1" {
        "sub"
    } else {
        "unsub"
    };
    let url = &format!("https://music.163.com/weapi/cloudvideo/video/{}", _t);
    let query_params = json_object!({
        "id": query.value("id").unwrap(),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/video/url")]
pub(crate) fn index_video_url(options: Options) -> FormatParams {
    let query = QueryParams::from(options.params);
    let url = "https://music.163.com/weapi/cloudvideo/playurl";
    let ids = r#"[\""#.to_owned() + query.value("id").unwrap() + r#"\"]"#;
    let query_params = json_object!({
        "ids": &ids[..],
        "resolution": query.value("res").unwrap_or("1080"),
    });
    let cookies = get_cookie_string(options.cookie);
    request_handler(url, "weapi", query_params, &cookies)
}

// #[get("/weblog")]
pub(crate) fn index_weblog(options: Options) -> FormatParams {
    let url = "https://music.163.com/weapi/feedback/weblog";
    empty_query_params_handler(url, "weapi", options.cookie)
}
