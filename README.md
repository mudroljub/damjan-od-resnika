# Damjan od Resnika

Damjan od Resnika, muzički projekat koji okuplja prijatelje iz kraja i šire.

## TODO

- prepoznaj font sa nalepnica
- organizovati art u podfoldere (albumi, nalepnice...)
- dodati novo:
  obnova-i-izgradnja
  mladifilozof
  noc-pod-nebom-alt

ČIŠĆENJE SLIKA:

magick ona-zivi-na-rubu-2.webp -colorspace Gray -contrast-stretch 0%x10% ona-zivi-na-rubu-x.webp
magick ona-zivi-na-rubu-2.webp -colorspace Gray -level 5%,95% -contrast-stretch 0%x5% crtez-print.webp
magick ona-zivi-na-rubu-2.webp -colorspace Gray -level 5%,95% -median 3 -contrast-stretch 0%x5% crtez-ujednaceno.webp
magick ona-zivi-na-rubu-2.webp -colorspace Gray -white-threshold 88% crtez-cistiji-jako.webp
magick ona-zivi-na-rubu-2.webp -colorspace Gray -level 8%,92% -contrast-stretch 0%x3% crtez-print-jako.webp
magick ona-zivi-na-rubu-2.webp -colorspace Gray -white-threshold 82% ona-zivi-na-rubu-x.webp
