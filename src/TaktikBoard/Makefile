DSTDIR := TaktikBoard

IMG := $(wildcard *.png)

HTML  = taktikboard.html
IHTML = $(HTML:%.html=$(DSTROOT)/$(DSTDIR)/%.html)

SCRIPTS  = sessionmgr.js util2.js eventhandlers.js
ISCRIPTS = $(SCRIPTS:%.js=$(DSTROOT)/$(DSTDIR)/%.js)


all:

install: $(ISCRIPTS) $(IHTML)
	echo $(DSTROOT)/$(DSTDIR)
	test -d $(DSTROOT)/$(DSTDIR) || install -d $(DSTROOT)/$(DSTDIR)
	for name in $(IMG); do \
		install -C -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done


$(DSTROOT)/$(DSTDIR)/%.js: %.js
	echo $@ $<
	curl -X POST -s --data-urlencode "input@$<" https://www.toptal.com/developers/javascript-minifier/api/raw > $@

$(DSTROOT)/$(DSTDIR)/%.html: %.html
	sed -e "s/__DATE__/$$(date --rfc-2822)/g" < $< \
	| curl -X POST -s --data-urlencode "input@-" https://www.toptal.com/developers/html-minifier/api/raw  > $@

clean:
	find . -iname \*~ -print0 |xargs -0 rm
