var btn = document.getElementById("add");
var clear = document.getElementById("clear");
var container = document.getElementById("container");
var txt = document.getElementById("text_input");

// display current keywords on the options page
window.onload = function(e) {
    chrome.storage.local.get(['keywords'], function(result) {
        let keywords = result.keywords;
        for (let keyword of keywords) {
            add_keyword_display(keyword);
        }
    });
}

// delete a keyword from the display and from storage, called when a '-' button is pressed
var delete_keyword = function(e) {
    // get the keyword that needs to be deleted
    let p = e.path[1].innerHTML;
    let keyword_to_delete = p.slice(0, p.search("<") - 1);
    // remove keyword from display
    e.path[1].remove();

    chrome.storage.local.get(['keywords'], function(result) {
        let old_keywords = result.keywords;
        // gets the current list of keywords, removes the word to be deleted from this list of keywords
        for (let i = 0; i < old_keywords.length; i++) {
            if (old_keywords[i] == keyword_to_delete) {
                old_keywords.splice(i, 1);
                i--;
            }
        }
        // update the keyword list with the new list of keywords
        chrome.storage.local.set({'keywords': old_keywords});
    });

}

// displays a keyword and adds it to storage
var add_keyword = function(e) {
    // get text of keyword to add
    let keyword_to_add = txt.value.toLowerCase();
    // remove text in text box
    txt.value = '';
    chrome.storage.local.get(['keywords'], function(result) {
        // get old list of keywords
        let old_keywords = result.keywords;
        // check if the word to be added is a duplicate
        if (!old_keywords.includes(keyword_to_add)) {
            add_keyword_display(keyword_to_add);
            // add new keyword to existing list of keywords and update the storage
            old_keywords.push(keyword_to_add);
            chrome.storage.local.set({'keywords': old_keywords});
        }
        else {
            alert("Adding duplicate words is not allowed");
        }
    });

};

// removes all keywords
var clear_all = function(e) {
    chrome.storage.local.set({'keywords': []});
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
}

// display a keyword and a button to delete it on the options page
var add_keyword_display = function(keyword) {
    let keyword_block = document.createElement("p");
    keyword_block.innerHTML = `${keyword} <input type = "button" value = "-"></input>`;
    container.appendChild(keyword_block);
    keyword_block.childNodes[1].addEventListener("click", delete_keyword);
};

btn.addEventListener("click", add_keyword);
clear.addEventListener("click", clear_all);
