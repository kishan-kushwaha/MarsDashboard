let store = {
    currentState: 'curiosity',
    roverInfo: {},
    roverImages: [],
}

// add our markup to the page
const root = document.getElementById('root');
const tabs= document.querySelectorAll('.tab');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state, renderInfo, renderImagesInformation)
}


// App() is a higher order function-
const App = (state, renderInfo, renderImagesInformation) => {
    const { roverInfo, roverImages } = state

    return generateHTMLInformation(roverInfo, roverImages, renderInfo, renderImagesInformation);
}

// generateHTMLInformation() is a higher order function-
const generateHTMLInformation = (roverInfo, roverImages,generateInfo,generateImage) => {
    const infoHTML= generateInfo(roverInfo);
    const imageHTML= generateImage(roverImages);
    return `
        <div>
            <div class="info-container">
                ${infoHTML}
            </div>
            <section class="image-container">
                ${imageHTML}
            </section>
        </div>
    `
}

const fetchData= async (store,currentState)=>{
    // await getImageOfTheDay(store, currentState);
    await getRoverData(store,currentState);
    await getRoverImages(store,currentState);
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', async () => {
    updateTabs(tabs,store);
    await fetchData(store,"curiosity");
    render(root, store);
})

const updateTabs = async (tabs,store)=>{
    tabs.forEach(tab => {
        tab.addEventListener('click',async event => {
            const currentState=event.target.id;
            await updateStore(store,{currentState: currentState});
            activeTab(tabs,currentState);
            fetchData(store,currentState);
        })
    });
}

const activeTab = (tabs,currentState)=>{
    tabs.forEach(tab=>{
        if(tab.id ===currentState){
            tab.classList.add('active')
        }else{
            tab.classList.remove('active')
        }
    })
}

// COMPONENTS
const renderInfo = (info) => {
    return `
       <h1>Here We can find  marsRover details.</h1>
     
    `
}

// A pure function that renders images requested from the backend
const renderImagesInformation = (images) => {
    let imageHTML=``;

    // here map() is also a higher order function
    images.slice(0,6).map(image => {
        imageHTML+=`
                    <figure class="image-card">
                        <img src="${image.img_src}" alt="Rover image" class="rover-image"/>
                        <figcaption>
                            <span><b>Rover: </b>${image.rover.name} </span><br>
                            <span><b>Mars days:</b> ${image.sol}</span><br/>
                            <span><b>Earth date:</b> ${image.earth_date}</span><br/>
                            <span><b>Launch date:</b> ${image.rover.launch_date}</span><br/>
                            <span><b>Landing date:</b> ${image.rover.landing_date}</span><br/>
                            <span><b>Rover State:</b> ${image.rover.status}</span>
                        </figcaption>
                    </figure>`
    })
    return imageHTML;
}

// API CALLS

const getRoverData = (store,roverName) => {
    fetch(`http://localhost:3000/roverInfo`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({roverName:roverName})
    })
        .then(res => res.json())
        .then(roverInfo => updateStore(store, { roverInfo: roverInfo }))
}

const getRoverImages = (store,roverName) => {
    fetch(`http://localhost:3000/fetchImage`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({roverName:roverName})
    })
        .then(res => res.json())
        .then(roverImages => updateStore(store, { roverImages: roverImages }))
}