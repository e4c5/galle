from django import forms
from _ast import Or

class PlayerForm(forms.Form):
    players = forms.CharField(widget=forms.Textarea)
    

class UploadForm(forms.Form):
    at_file = forms.FileField()
    config_file = forms.FileField()
    
    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data['at_file'].size > 500*1024:
            raise forms.ValidationError("Max size is 500k")
        if cleaned_data['config_file'].size > 100*1024:
            raise forms.ValidationError("Max size is 100k")
        
