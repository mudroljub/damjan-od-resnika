# Damjan od Resnika

Damjan od Resnika, muzički projekat koji okuplja prijatelje iz kraja i šire.

## TODO

- prepoznaj font sa nalepnica

ČIŠĆENJE SLIKA:

magick noc-pod-nebom-alt.webp -colorspace Gray -contrast-stretch 0%x10% crtez-lagano.webp
magick noc-pod-nebom-alt.webp -colorspace Gray -level 5%,95% -contrast-stretch 0%x5% crtez-print.webp
magick noc-pod-nebom-alt.webp -colorspace Gray -level 5%,95% -median 3 -contrast-stretch 0%x5% crtez-ujednaceno.webp
magick noc-pod-nebom-alt.webp -colorspace Gray -white-threshold 88% crtez-cistiji-jako.webp
magick noc-pod-nebom-alt.webp -colorspace Gray -level 8%,92% -contrast-stretch 0%x3% crtez-print-jako.webp
magick noc-pod-nebom-alt.webp -colorspace Gray -white-threshold 82% crtez-xx.webp
