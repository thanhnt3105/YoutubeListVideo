import axios from "axios";


const APIKey = 'AIzaSyAx9x88itHTLI2RwKkCR7BI_Dg3XB-et5g';
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
  // console.log("channelID",channelID);
  try {
    const res = await axios.get(
      `${youtubeUrl}/playlists?part=${paramGetPlaylistArr.part}&channelId=${channelID}&maxResults=${paramGetPlaylistArr.maxResults}&key=${APIKey}`);
    // console.log("res.data",res.data);
    let nextPageToken = res.data.nextPageToken;
    // console.log("nextPageToken",nextPageToken);
    playlistIdSet.push(res.data.items.map((item)=>item.id));
    while(nextPageToken){
      const nextPage = await axios.get(`${youtubeUrl}/playlists?part=${paramGetPlaylistArr.part}&channelId=${channelID}&maxResults=${paramGetPlaylistArr.maxResults}&pageToken=${nextPageToken}&key=${APIKey}`)
      // console.log("nextPage",nextPage.data);
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

//Get id videos

async function getIdlVideo(){
  let videosId=[];
  const paramgetIdlVideo={
    part:'contentDetails',
    maxResults:'5',
  }
  const playlistIdSet = await getPlaylistArr();
  // console.log("playlistIdSet",playlistIdSet);

  for(let i=0;i<playlistIdSet.length;i++){
    const videoData = await axios.get(
      `${youtubeUrl}/playlistItems?part=${paramgetIdlVideo.part}&maxResults=${paramgetIdlVideo.maxResults}&playlistId=${playlistIdSet[i]}&key=${APIKey}`
    )
    videosId.push(videoData.data.items.map((item)=>item.contentDetails.videoId))
    let nextPageToken = videoData.data.nextPageToken;
    while(nextPageToken){
      const nextPage = await axios.get(
        `${youtubeUrl}/playlistItems?part=${paramgetIdlVideo.part}&maxResults=${paramgetIdlVideo.maxResults}&pageToken=${nextPageToken}&playlistId=${playlistIdSet[i]}&key=${APIKey}`
        )
      // console.log("nextPage",nextPage.data);
      videosId.push(nextPage.data.items.map((item)=>item.contentDetails.videoId))
      if(nextPage.data.nextPageToken) {
        nextPageToken = nextPage.data.nextPageToken;
      }
      else nextPageToken=null;
    }
    // console.log("videoData",i,videoData.data.items.map((item)=>item.contentDetails.videoId));
  }
  return videosId.flat();
}
function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

async function getDetailVideo (){
  const idVideos = await getIdlVideo();
  // console.log("idVideos",idVideos);
  const detailVideos = [];
  const paramDetailVideo={
    part:'snippet',
  }
  let i=0;
  do{
    const obj ={
      title:"",
      thumbnails:null,
      publishTime:null,
    }
    const detailVideo = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=${paramDetailVideo.part}&id=${idVideos[i]}&key=${APIKey}`
    )
    if(detailVideo.data.items.length !=0 ){
      obj.title= detailVideo.data.items[0].snippet.title;
      obj.thumbnails=detailVideo.data.items[0].snippet.thumbnails;
      obj.publishTime = detailVideo.data.items[0].snippet.publishedAt;
    }
    detailVideos.push(obj);
    detailVideos
    i++;
  }
  while(i<idVideos.length);
  return detailVideos;
}

const result = await getDetailVideo();
console.log("result",result);