#
# (__SYS__=5_1; __ROTA__=1; sed -e "s/__SYS__/${__SYS__}/g;s/__ROTA__/${__ROTA__}/g;s/__DATE__/$(date --rfc-2822 )/g" <testbed.html )|less
#
DSTDIR := Spielsys

SRC = ball_t.png  fabric.js  myinit.js  setpos.js  spielsys.css
DSTFILES= $(foreach name, $(SRC), $(DSTDIR)/$(name))
HTMLSRC= d2.m4 blank.html

all: $(DSTDIR) $(DSTDIR)/5_1_rot1.html # $(DSTFILES)
	cp $(SRC) $(DSTDIR)

install:
	echo $(DSTROOT)/$(DSTDIR)
	install -d $(DSTROOT)/$(DSTDIR)
	install -m644 $(SRC) $(DSTROOT)/$(DSTDIR)

$(DSTDIR)/5_1_rot1.html: d2.m4 blank.html
	for s in 5_1 4_2; do for r in 1 2 3 4 5 6; do \
	m4 -D_SPSYS=$$s -D_ROTA=$$r blank.html | tail -n+4 > $(DSTDIR)/$${s}_rot$${r}.html ; \
	done; done

$(DSTDIR):
	mkdir -p $(DSTDIR)

grumpf:
	for s in 5_1 4_2; do for r in 1 2 3 4 5 6; do\
		sed -e "s/__SYS__/$$s/g;s/__ROTA__/$$r/g;s/__DATE__/$$(date --rfc-2822)/g" < testbed.html > $${s}_r$${r}.html ;\
	done; done
foo: $(CPYFILES)
	echo $(CPYFILES) $(DSTDIR)
	cp $(CPYFILES) $(DSTDIR)
#
## $(warning input is $(1) end)

define COPY_template
$(DSTDIR)/$(1): $(1)
	cp $$^ $$@
endef

## $foreach(dep, $(CPYFILES), $(eval $(call COPY_template,$(dep))))
$(foreach dep, $(CPYFILES), $(eval $(call COPY_template,$(dep))))


release: $(CPYFILES)
	for u in $(CPYFILES); do echo $$u; cp -f $$u $(DSTDIR); done


