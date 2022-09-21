DSTDIR := TaktikBoard

SRC := $(wildcard *.png) taktikboard.html util2.js eventhandlers.js

all:

install:
	echo $(DSTROOT)/$(DSTDIR)
	test -d $(DSTROOT)/$(DSTDIR) || install -d $(DSTROOT)/$(DSTDIR)
	for name in $(SRC); do \
		install -C -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done
	sed -e "s/__DATE__/$$(date --rfc-2822)/g" < taktikboard.html \
	| curl -X POST -s --data-urlencode "input@-" https://www.toptal.com/developers/html-minifier/api/raw \
	  > $(DSTROOT)/$(DSTDIR)/taktikboard.html
clean:
	find . -iname \*~ -print0 |xargs -0 rm
