

const userAction = async () => {
  const response = await fetch('https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=341248');
  const myJson = await response.json(); //extract JSON from the http response
  console.log('USER ACTION ACTIVATED');
}

userAction();
