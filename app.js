const API = "330216c7221b68e42208f36c509eba8b"; // public cuz not even that important dwww
const USER = "heartlye"; // my user


const screenEl = document.querySelector(".screen");
const trackBackEl = document.getElementById("track-back");
const trackFrontEl = document.getElementById("track-front");
const recordEl = document.getElementById("record");
const recordWrapperEl = document.getElementById("record-wrapper");
const labelEl = document.getElementById("label");
let lastTrackKey = "";

function updateTrackText(text) { // small helper function
    trackBackEl.textContent = text;
    trackFrontEl.textContent = text;
}

async function fetchNowPlaying() {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USER}&api_key=${API}&format=json&limit=1`; // url of the endpoint to be fetched

    try {
        const res = await fetch(url);
        const data = await res.json();

        // response eg: {"recenttracks":{"track":[{"artist":{"mbid":"f149ef8c-9acb-4335-bb1a-aee1fe74c733","#text":"Yan Qing"},"streamable":"0","image":[{"size":"small","#text":"https:\/\/lastfm-img.freetls.fastly.net\/i\/u\/34s\/b9ff5ac4f00d33d79fddba32ab42f6ad.jpg"},{"size":"medium","#text":"https:\/\/lastfm-img.freetls.fastly.net\/i\/u\/64s\/b9ff5ac4f00d33d79fddba32ab42f6ad.jpg"},{"size":"large","#text":"https:\/\/lastfm-img.freetls.fastly.net\/i\/u\/174s\/b9ff5ac4f00d33d79fddba32ab42f6ad.jpg"},{"size":"extralarge","#text":"https:\/\/lastfm-img.freetls.fastly.net\/i\/u\/300x300\/b9ff5ac4f00d33d79fddba32ab42f6ad.jpg"}],"mbid":"","album":{"mbid":"6f256965-7b36-40ae-97af-4b6fc454b562","#text":"The Arrival"},"name":"The Arrival","@attr":{"nowplaying":"true"},"url":"https:\/\/www.last.fm\/music\/Yan+Qing\/_\/The+Arrival"},{"artist":{"mbid":"64b94289-9474-4d43-8c93-918ccc1920d1","#text":"Billy Joel"},"streamable":"0","image":[{"size":"small","#text":"https:\/\/lastfm-img.freetls.fastly.net\/i\/u\/34s\/691231b859b64a80f37eae71d6895ad6.jpg"},{"size":"medium","#text":"https:\/\/lastfm-img.freetls.fastly.net\/i\/u\/64s\/691231b859b64a80f37eae71d6895ad6.jpg"},{"size":"large","#text":"https:\/\/lastfm-img.freetls.fastly.net\/i\/u\/174s\/691231b859b64a80f37eae71d6895ad6.jpg"},{"size":"extralarge","#text":"https:\/\/lastfm-img.freetls.fastly.net\/i\/u\/300x300\/691231b859b64a80f37eae71d6895ad6.jpg"}],"mbid":"","album":{"mbid":"","#text":"And so it goes"},"name":"Piano Man (The Old Grey Whistle Test)","url":"https:\/\/www.last.fm\/music\/Billy+Joel\/_\/Piano+Man+(The+Old+Grey+Whistle+Test)","date":{"uts":"1790131781","#text":"23 Sep 2026, 02:49"}}],"@attr":{"user":"heartlye","totalPages":"8","page":"1","perPage":"1","total":"8"}}}

        const latest = data?.recenttracks?.track?.[0];

        if (!latest) {
            setIdle();
            return;
        }

        const isNowPlaying = latest["@attr"]?.nowplaying === "true";

        if (isNowPlaying) {
            const albumArtUrl = latest.image?.find((img) => img.size === "extralarge")?.["#text"] || "";
            setPlaying(latest.name, albumArtUrl);
        } else {
            setIdle();
        }
    } catch (err) {
        setError();
    }
}

function setPlaying(track, albumArtUrl) { // changes track to what im playing
    if (track === lastTrackKey) return;
    lastTrackKey = track;

    recordEl.classList.add("playing");

    if (albumArtUrl) {
        getDomColor(albumArtUrl, (rgb) => {
            djTransition(track, albumArtUrl, rgb);
        });
    } else {
        djTransition(track, "", { r: 219, g: 213, b: 181 });
    }
}

function setIdle() { // sets to idle if I'm not playing anything
    updateTrackText("not listening to anything (maybe sleeping)");

    labelEl.style.backgroundImage = "none";
    recordEl.classList.remove("playing");
    lastTrackKey = "";
}

function setError() { //ERROR thingy
    updateTrackText("couldn't reach last.fm \n please check :3");
    recordEl.classList.remove("playing");
    lastTrackKey = "";
}


function getDomColor(imageUrl, callback) { // we will get the dominant color in the album to keep as background, given by sum of all / count. :p
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            let r = 0, g = 0, b = 0, count = 0;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i+1];
                b += data[i+2];
                count++;
            }

            callback({
                r: Math.round( r / count ),
                g: Math.round( g / count ),
                b: Math.round( b / count )
            });
        } catch (err) {
            callback({ r: 219, g: 213, b: 181 }); // fallback to original value
        }
    };

    img.onerror = () => callback({ r: 219, g: 213, b:181 }); // fallback to original value
}

function rgbToHsl(r, g, b) {
    // first of all we goota scale r, g and b values to 0.0 to 1.0
    r /= 255;
    g /= 255;
    b /= 255;

    // we find min, max and difference (also known as delta) value
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    // we find lightness(L) : i.e. (max + min) / 2
    let l = (max + min) / 2;

    // we find saturation(S) : i.e. L <= 0.5 ==> S = d/(max+min)
    // if L > 0.5 ==> S = d / (2 - min - max)
    let s = 0;
    if (d !== 0) {
        s = l > 0.5 ? d / (2 - min - max): d / (min + max);
    }

    // we find hue(H) : i.e.
    // if red is max: H = (g-b)/d + (g<b? 6: 0);
    // if green is max: (b-r)/d + 4
    // if blue is max: (r-g)/d + 4
    let h = 0;
    if (d !== 0) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6: 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6; // normalize da h to 0.0 to 1.0
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function djTransition(newTrackName, albumArtUrl, rgb) { // THis will be like new transition between new song :p
    trackBackEl.classList.add("hidden");
    trackFrontEl.classList.add("hidden");

    screenEl.classList.remove("dj");
    recordWrapperEl.classList.remove("dj");
    
    void screenEl.offsetWidth;

    screenEl.classList.add("dj");
    recordWrapperEl.classList.add("dj");

    setTimeout(() => {
        if (albumArtUrl) {
            labelEl.style.backgroundImage = `url("${albumArtUrl}")`;
        }

        const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const isLight = l > 55;

        const newBgColor = `hsl(${h}, ${s}%, ${l}%)`;
        const textLightness = isLight ? Math.max(l - 35, 5) : Math.min(l + 35, 95);
        const newTextColor = `hsl(${h}, ${s}%, ${textLightness}%)`;

        const discS = Math.min(100, s * 1.2 + 5);
        const discL = isLight ? Math.max(l - 16, 8) : Math.min(l + 16, 92);
        const newDiscColor = `hsl(${h}, ${discS}%, ${discL}%)`;

        document.documentElement.style.setProperty("--bg", newBgColor);
        document.documentElement.style.setProperty("--text", newTextColor);
        document.documentElement.style.setProperty("--disc", newDiscColor);
    }, 400);

    setTimeout(() => {
        updateTrackText(newTrackName);
        trackBackEl.classList.remove("hidden");
        trackFrontEl.classList.remove("hidden");
    }, 800);

    setTimeout(() => {
        screenEl.classList.remove("dj");
        recordWrapperEl.classList.remove("dj");
    }, 1200);
}

fetchNowPlaying();
setInterval(fetchNowPlaying, 10000);