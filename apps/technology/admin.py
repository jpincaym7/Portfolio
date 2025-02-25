from django.contrib import admin
from apps.technology.models import TechnologyCategory, Technology, SubTechnology, ExpertiseLevel

@admin.register(TechnologyCategory)
class TechnologyCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon_code', 'icon_color')
    search_fields = ('name',)

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'is_main_tech')
    list_filter = ('category', 'is_main_tech')
    search_fields = ('name',)

@admin.register(SubTechnology)
class SubTechnologyAdmin(admin.ModelAdmin):
    list_display = ('name', 'technology')
    search_fields = ('name', 'technology__name')

@admin.register(ExpertiseLevel)
class ExpertiseLevelAdmin(admin.ModelAdmin):
    list_display = ('technology', 'level')
    list_filter = ('level',)
    search_fields = ('technology__name',)

