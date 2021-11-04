BUILDDIR = ../../build/Spielsys


CPYFILES = ball_t.png  fabric.js  myinit.js  setpos.js  spielsys.css
DSTFILES = $(foreach name, $(CPYFILES), $(BUILDDIR)/$(name))

all: $(DSTFILES) $(BUILDDIR)/5_1_rot1.html

$(BUILDDIR)/5_1_rot1.html: d2.m4 blank.html
	for s in 5_1 4_2; do for r in 1 2 3 4 5 6; do \
	m4 -D_SPSYS=$$s -D_ROTA=$$r blank.html | tail -n+4 > $(BUILDDIR)/$${s}_rot$${r}.html ; \
	done; done

foo: $(CPYFILES)
	echo $(CPYFILES) $(BUILDDIR)
	cp $(CPYFILES) $(BUILDDIR)
#
## $(warning input is $(1) end)

define COPY_template
$(BUILDDIR)/$(1): $(1)
	cp $$^ $$@
endef

## $foreach(dep, $(CPYFILES), $(eval $(call COPY_template,$(dep))))
$(foreach dep, $(CPYFILES), $(eval $(call COPY_template,$(dep))))


release: $(CPYFILES)
	for u in $(CPYFILES); do echo $$u; cp -f $$u $(BUILDDIR); done


