#
#
#
DSTDIR := tadaVolley
SRC = css/dvstyle.css  css/jquery.dataTables.min.css
SRC += js/jquery-3.5.1.js 
SRC += js/jquery.dataTables.min.js

SCRIPTS= js/DragDropTouch.js js/common.js js/dvmain.js js/enablers.js
ISCRIPTS = $(SCRIPTS:%.js=$(DSTROOT)/$(DSTDIR)/%.js)

HTML = dvmain.html tadavolley.html
IHTML = $(HTML:%.html=$(DSTROOT)/$(DSTDIR)/%.html)

# Nothing for all
all:
#
install: $(SRC) $(ISCRIPTS) $(IHTML)
	echo $(DSTROOT)/$(DSTDIR)
	mkdir -p $(DSTROOT)/$(DSTDIR)/css
	mkdir -p $(DSTROOT)/$(DSTDIR)/js
	for name in $(SRC); do \
		install -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done

$(DSTROOT)/$(DSTDIR)/%.js: %.js
	echo $@ $<
	curl -X POST -s --data-urlencode "input@$<" https://www.toptal.com/developers/javascript-minifier/api/raw > $@
$(DSTROOT)/$(DSTDIR)/%.html: %.html
	sed -e "s/__DATE__/$$(date --rfc-2822)/g" < $< \
	| curl -X POST -s --data-urlencode "input@-" https://www.toptal.com/developers/html-minifier/api/raw  > $@> $@ 
