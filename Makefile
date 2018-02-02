deploy:
	rsync -v -essh -a build/* status2@status.dedis.ch:www
