## Makefile for waveform playlist

all: install

bundle:
	npm install
	npx webpack

install:
	install -d /var/www/html/colmena_audio_editor
	cp -r dist/waveform-playlist/* /var/www/html/waveform-playlist
