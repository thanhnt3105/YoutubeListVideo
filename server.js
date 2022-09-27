import axios from "axios";


const APIKey = 'AIzaSyCA34YHKhuWEPIj0PzWlbKCmzsqVdd2GRQ';
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
    maxResults:'50',
  }
  const channelID = await getChannelId();
  console.log("channelID",channelID);
  axios.get(
    `${youtubeUrl}/playlists?part=${paramGetPlaylistArr.part}&channelId=${channelID}&maxResults=${paramGetPlaylistArr.maxResults}&key=${APIKey}`)
  .then((res)=>{
    playlistIdSet.push(res.data.items.map((item)=>item.id));
    console.log("playlistIdSet",playlistIdSet);
  })
  .catch((err)=>{
    console.log("err",err);
  })
  return playlistIdSet;
}
getPlaylistArr();

//-Save playlist url to arr with pagination

