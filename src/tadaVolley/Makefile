#
#
#
DSTDIR := tadaVolley
SRC = css/dvstyle.css  css/jquery.dataTables.min.css
SRC += js/jquery-3.5.1.js js/DragDropTouch.js js/common.js js/dvmain.js
SRC += js/jquery.dataTables.min.js
SRC += dvmain.html tadavolley.html

# Nothing for all
all:
#
install: $(SRC)
	echo $(DSTROOT)/$(DSTDIR)
	mkdir -p $(DSTROOT)/$(DSTDIR)/css
	mkdir -p $(DSTROOT)/$(DSTDIR)/js
	for name in $(SRC); do \
		install -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done
