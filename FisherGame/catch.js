function attachEvents() {

    const baseUrl = 'https://baas.kinvey.com/appdata/kid_Sy0mt9koM';
    const userName = 'peter';
    const password = 'p';
    const base64auth = btoa(userName+ ':' + password);

    const authHeader = {
        "Authorization":"Basic " + base64auth,
        'Content-type':'application/json'
    };
    console.log(authHeader);

    $('.load').click(loadAllCatches);
    

    function request(method,endpoint,data) {
        return $.ajax({
            method:method,
            url:baseUrl +  endpoint,
            headers:authHeader ,
            data:JSON.stringify(data)
        })

    }
    
    function loadAllCatches() {
        request('GET','/biggestCatches')
            .then(displayAllCatches)
            .catch(handleError)
    }

    function displayAllCatches(data) {

        let catches = $('#catches');
        catches.empty();
        for (let el of data) {

            catches.append($(`<div class="catch" data-id="${el._id}">`)
                .append($('<label>')
                    .text('Angler'))
                .append($(`<input type="text" class="angler" value="${el['angler']}"/>`))
                .append($('<label>')
                    .text('Weight'))
                .append($(`<input type="number" class="weight" value="${el['weight']}"/>`))
                .append($('<label>')
                    .text('Species'))
                .append($(`<input type="text" class="species" value="${el['species']}"/>`))
                .append($('<label>')
                    .text('Location'))
                .append($(`<input type="text" class="location" value="${el['location']}"/>`))
                .append($('<label>')
                    .text('Bait'))
                .append($(`<input type="text" class="bait" value="${el['bait']}"/>`))
                .append($('<label>')
                    .text('Capture Time'))
                .append($(`<input type="text" class="captureTime" value="${el['captureTime']}"/>`))
                .append($('<button class="update">Update</button>').click(updateCatch))
                .append($('<button class="delete">Delete</button>').click(deleteCatch)))
        }
    }

    //ajax request for update of catch
    function updateCatch() {
        let catchEl = $(this).parent();
        let dataObj  = createDataJson(catchEl);

        request('PUT',`/biggestCatches/${catchEl.attr('data-id')}`,dataObj)
            .then(loadAllCatches)
            .catch(handleError)
    }
    //ajax request for delete of catch 
    function deleteCatch() {
        let catchId = $(this).parent().attr('data-id');
        request('DELETE',`/biggestCatches/${catchId}`).then(loadAllCatches).catch(handleError)
    }
    
    function createDataJson(catchEl) {
        return {
            angler: catchEl.find('.angler').val(),
            weight:catchEl.find('.weight').val(),
            species: catchEl.find('.species').val(),
            location: catchEl.find('.location').val(),
            bait:catchEl.find('.bait').val(),
            captureTime:catchEl.find('.captureTime').val()
        }
    }
    
    function handleError(err) {
        alert(`Error: ${err.statusText}`)
    }

}