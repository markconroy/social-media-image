const message = document.querySelector('.input-message');
const topTextInput = document.querySelector('.input-text-top');
const bottomTextInput = document.querySelector('.input-text-bottom');
const backgroundColorInput = document.querySelector('.input-background-color');
const rememberBackgroundCheckbox = document.querySelector('.input-remember-color');
const topText = document.querySelector('.text-top');
const bottomText = document.querySelector('.text-bottom');
const imageAltText = document.querySelector('.image-alt p');
const createButton = document.querySelector('.create-image-button');
const imageContainer = document.querySelector('#image');

// Check if there is any values in the localStorage object called 'SocialMediaImage'
// If there is, set the :root variables to the values
const SocialMediaImage = JSON.parse(localStorage.getItem('SocialMediaImage'));
if (SocialMediaImage) {
  const h = SocialMediaImage[0].h;
  const s = SocialMediaImage[1].s;
  const l = SocialMediaImage[2].l;
  document.documentElement.style.setProperty('--color-value-h', h);
  document.documentElement.style.setProperty('--color-value-s', `${s}%`);
  document.documentElement.style.setProperty('--color-value-l', `${l}%`);
  // Set the text color based on the background color.
  if (l > 50) {
    document.documentElement.style.setProperty('--color-text', '#000');
  } else {
    document.documentElement.style.setProperty('--color-text', '#fff');
  }
}

topTextInput.addEventListener('input', () => {
  topText.textContent = topTextInput.value;
});

bottomTextInput.addEventListener('input', () => {
  bottomText.textContent = bottomTextInput.value;
});

backgroundColorInput.addEventListener('input', () => {
  // Set :root variable to the input value.
  const hsl = convertHexToHsl(backgroundColorInput.value);
  const [h, s, l] = hsl;
  document.documentElement.style.setProperty('--color-value-h', h);
  document.documentElement.style.setProperty('--color-value-s', `${s}%`);
  document.documentElement.style.setProperty('--color-value-l', `${l}%`);
  // Set the text color based on the background color.
  if (l > 50) {
    document.documentElement.style.setProperty('--color-text', '#000');
  } else {
    document.documentElement.style.setProperty('--color-text', '#fff');
  }
});

createButton.addEventListener('click', () => {
  // If remember background color is checked, save the color values to local
  // storage.
  if (rememberBackgroundCheckbox.checked) {
    // Delete the old values
    localStorage.removeItem('SocialMediaImage');
    const SocialMediaImage = [];
    const hsl = convertHexToHsl(backgroundColorInput.value);
    const [h, s, l] = hsl;
    // Add the background colors to the localStorage object
    SocialMediaImage.push({h: h});
    SocialMediaImage.push({s: s});
    SocialMediaImage.push({l: l});

    // Update the localStorage with the new color values
    localStorage.setItem('SocialMediaImage', JSON.stringify(SocialMediaImage));
  }

  // Set the alt text of the image to the top and bottom text.
  imageAltText.textContent = `${topTextInput.value} ${bottomTextInput.value}`;

  html2canvas(document.querySelector("#container")).then(canvas => {
    const base64image = canvas.toDataURL("image/png");
    image.querySelector('img').src = base64image;
  });
})

// Convert hex to rgb, then rbg to hsl
// Taken from https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/
const hexToRgb = hex => {
  let alpha = false,
    h = hex.slice(hex.startsWith('#') ? 1 : 0);
  if (h.length === 3) h = [...h].map(x => x + x).join('');
  else if (h.length === 8) alpha = true;
  h = parseInt(h, 16);
  return (
    'rgb' +
    (alpha ? 'a' : '') +
    '(' +
    (h >>> (alpha ? 24 : 16)) +
    ', ' +
    ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
    ', ' +
    ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
    (alpha ? `, ${h & 0x000000ff}` : '') +
    ')'
  );
};

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};

function convertHexToHsl(hex) {
  const rgb = hexToRgb(hex);
  const [r, g, b] = rgb.match(/\d+/g);
  return rgbToHsl(r, g, b);
}