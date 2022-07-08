const grabBtn : HTMLElement | null = document.getElementById("getData");

// Check if URL is https://get.google.com/albumarchive/ then grab the images

if (grabBtn) {
  grabBtn.addEventListener("click",() => {    
      chrome.tabs.query({active: true}, (tabs) => {
        var tab : chrome.tabs.Tab = tabs[0];
        if (tab && tab.id) {
            chrome.scripting.executeScript(
                {
                    target:{tabId: tab.id, allFrames: true},
                    func:grabImages
                },
                onResult
            )
        } else {
            alert("There are no active tabs")
        }
      })
  })
}

function filterAlbumImages(images : NodeListOf<HTMLImageElement>) : NodeListOf<HTMLImageElement> {
  
  
  return(images);
}

function grabImages() : string[] {
  const images : NodeListOf<HTMLImageElement> = (document.querySelectorAll("img"));
  
  
  let imageStrings : string [] = Array.from(images).map(image=>image.src);
  // Exclude Profile Picture from images
  imageStrings = imageStrings.filter(image=>!image.includes("/ogw/"));
  
  // Exclude Profile Picture from images
  imageStrings = imageStrings.map(image => image.split("=")[0] + "=w0-h0" + "-no-tmp.jpg")


  return imageStrings;
}

function onResult(frames : any) {
  // If script execution failed on the remote end 
  // and could not return results
  if (!frames || !frames.length) { 
      alert("Could not retrieve images from specified page");
      return;
  }
  // Combine arrays of the image URLs from 
  // each frame to a single array
  const imageUrls : string[] = frames.map((frame : any)=>frame.result).reduce((r1: any, r2: any) => r1.concat(r2));
  
  // Copy to clipboard a string of image URLs, delimited by 
  // carriage return symbol  
  window.navigator.clipboard
        .writeText(imageUrls.join("\n"))
        .then(()=>{
           // close the extension popup after data 
           // is copied to the clipboard
           window.close();
        });
}