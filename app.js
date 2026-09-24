const API = "330216c7221b68e42208f36c509eba8b"; // public cuz not even that important dwww
const USER = "heartlye"; // my user


const statusEl = document.getElementById("status");
const trackEl = document.getElementById("track");
const artistEl = document.getElementById("artist");

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
            setPlaying(latest.name, latest.artist["#text"]);
        } else {
            setIdle();
        }
    } catch (err) {
        setError();
    }
}

function setPlaying(track, artist) { // changes track to what im playing
    statusEl.textContent = "now playing";
    trackEl.textContent = track;
    artistEl.textContent = artist;
}

function setIdle() { // sets to idle if I'm not playing anything
    statusEl.textContent = "not listening to anything (maybe sleeping)";
    trackEl.textContent = "..silence..";
    artistEl.textContent = "..world..";
}

function setError() { //ERROR thingy
    statusEl.textContent = "couldn't reach last.fm";
    trackEl.textContent = "please check :3";
    artistEl.textContent = "api";
}

fetchNowPlaying();
setInterval(fetchNowPlaying, 10000) // every 10 sec