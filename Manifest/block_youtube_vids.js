var remove_censored_videos = function(e) {
    chrome.storage.local.get(['keywords'], function(result) {
        // removes most videos
        let video_titles = document.getElementsByTagName("h3");
        for (const video_title of video_titles) {
            if (video_title.innerText != "") {
                for (const keyword of result.keywords) {
                    if (video_title.innerText.toLowerCase().includes(keyword)) {
                        let video_container = get_video_container(video_title);
                        if (video_container != null) {video_container.remove();}
                    }
                }
            }
        }
        // remove playlists which appear when you search for videos
        let playlist_titles = document.getElementsByTagName("ytd-playlist-renderer");
        if (playlist_titles.length > 0) {
            for (let playlist_title of playlist_titles) {
                for (const keyword of result.keywords) {
                    if (playlist_title.innerText.toLowerCase().includes(keyword)) {
                        playlist_title.parentElement.parentElement.remove();
                    }
                }
            }
        }
        // remove videos from notifications
        let notification_titles = document.getElementsByTagName("ytd-notification-renderer");
        if (notification_titles.length > 0) {
            for (let notification_title of notification_titles) {
                for (const keyword of result.keywords) {
                    // gets real title from the notification title's inner text, it is after the ":" in the inner text"
                    let exact_title = notification_title.innerText.slice( notification_title.innerText.indexOf(":") + 2 );
                    if (exact_title.toLowerCase().includes(keyword)) {
                        notification_title.remove();
                    }
                }
            }
        }
        // remove side card renderer
        let watch_card = document.getElementsByTagName("ytd-universal-watch-card-renderer")[0];
        for (const keyword of result.keywords) {
            if (watch_card.innerText.toLowerCase().includes(keyword)) {
                watch_card.remove();
            }
        }
    });
}

// gets video container. The container is the element with id "dismissable"
var get_video_container = function(video_title) {
    let element = video_title;
    while (element != null && element.id != "dismissable") {
        element = element.parentElement;
    }
    return element;
}

setInterval(remove_censored_videos, 500);
remove_censored_videos();
