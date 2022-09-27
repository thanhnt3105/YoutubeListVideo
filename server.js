import axios from "axios";


const APIKey = 'AIzaSyAqLYjRu8bziOPMgzUxoo6pqTC8mzWmylQ';
const inputUrl = 'https://www.youtube.com/c/TaynguyenSoundOfficial' ;
const youtubeUrl = 'https://youtube.googleapis.com/youtube/v3' ;

//Get channel name from URL by using Regex
let reChannelName = /^https?:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]{21}[AQgw]|(c\/|user\/)?[\w-]+)$/ ;
const match = reChannelName.exec(inputUrl);
const channelName = match[2].slice(2, match[2].length);

//get channelID
async function getChannelId(){
  let channelId = null;
  const paramGetChannelId = {
    part:'snippet',
    maxResults:'10',
    type:'channel',
  }
  try {
    const res = await axios.get(
      `${youtubeUrl}/search?part=${paramGetChannelId.part}&maxResults=${paramGetChannelId.maxResults}&q=${channelName}&type=${paramGetChannelId.type}&key=${APIKey}`)
    channelId=res.data.items[0].id.channelId;
  } catch (error) {
    console.log(error);
  }
  return channelId;
}

//get playlist arr
async function getPlaylistArr(){
  let playlistIdSet=[];
  const paramGetPlaylistArr = {
    part:'snippet%2CcontentDetails',
    maxResults:'5',
  }
  const channelID = await getChannelId();
  console.log("channelID",channelID);
  try {
    const res = await axios.get(
      `${youtubeUrl}/playlists?part=${paramGetPlaylistArr.part}&channelId=${channelID}&maxResults=${paramGetPlaylistArr.maxResults}&key=${APIKey}`);
    console.log("res.data",res.data);
    let nextPageToken = res.data.nextPageToken;
    console.log("nextPageToken",nextPageToken);
    playlistIdSet.push(res.data.items.map((item)=>item.id));
    while(nextPageToken){
      const nextPage = await axios.get(`${youtubeUrl}/playlists?part=${paramGetPlaylistArr.part}&channelId=${channelID}&maxResults=${paramGetPlaylistArr.maxResults}&pageToken=${nextPageToken}&key=${APIKey}`)
      console.log("nextPage",nextPage.data);
      playlistIdSet.push(nextPage.data.items.map((item)=>item.id));
      if(nextPage.data.nextPageToken) {
        nextPageToken = nextPage.data.nextPageToken;
      }
      else nextPageToken=null;
    }
  } catch (error) {
    
  }
  return playlistIdSet.flat();
}
const result = await getPlaylistArr();
console.log("result",result);

