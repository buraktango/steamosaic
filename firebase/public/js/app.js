onSubmit = (event) => {
  event.preventDefault();
  const input = document.getElementById('input');
  var el = document.createElement('a');
  el.href = input.value;
  const value = el.pathname.replace(/\/$/, '').split('/').slice(-1).pop().trim().toLowerCase();

  if (value) {
    window.location.hash = value;
  }
};

render = () => {
  const uid = window.location.href.split('#')[1] || '';
  const element = document.getElementById('container');
  uid ? renderMosaic(uid, element) : renderInput(element);
}

renderInput = (element) => {
  const html = `
    <form class="outer" action="#" onsubmit="onSubmit(event); return false;" >
      <p>enter your steam profile</p>
      <input id="input" type="text" placeholder="https://steamcommunity.com/id/skhaz or skhaz"></input>
    </form>
    `;

  element.innerHTML = html;
}

renderMosaic = (uid, element) => {
  const firestore = firebase.app().firestore();
  const ref = firestore.collection('users').doc(uid);
  const unsubscribe = ref.onSnapshot((snapshot) => {
    if (!snapshot.exists) {
      ref.set({ void: true });
    }

    const doc = snapshot.data();
    const url = doc && doc.url;
    const error = doc && doc.error;
    const loading = error === undefined && url === undefined;
    let html;
    if (loading) {
      html = `
      <center>
        <h2>generating... can take a while.</h2>
      </center>`;
    } else {
      if (url) {
        html = `<img class="display" src="${url}">`;
      } else if (error) {
        html = `
          <center>
            <h2>${error}</h2>
            <a href="/">go back</a>
          </center>`;  
      }

      unsubscribe();
    }

    element.innerHTML = html;
  });
}

document.addEventListener('DOMContentLoaded', render);
window.addEventListener('hashchange', render);

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-134529977-1');
