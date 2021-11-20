#
#
#
DSTDIR := tadaVolley
SRC= css/dvstyle.css  js/DragDropTouch.js js/common.js js/dvmain.js  dvmain.html tadavolley.html
# Nothing for all
all:
#
install: $(SRC)
	echo $(DSTROOT)/$(DSTDIR)
	mkdir -p $(DSTROOT)/$(DSTDIR)/{css,js}
	for name in $(SRC); do \
		install -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done
