from setuptools import find_packages
from setuptools import setup

setup(
    name='basket',
    version='0.0.1',
    description='Heramienta de Automatizacion de ALSW',
    author='ChepeCarlos',
    author_email='chepecarlos@alswblog.org',
    url='https://github.com/chepecarlos/Basket',
    install_requires=[],
    packages=find_packages(where='src', exclude=('tests*', 'testing*')),
    package_dir={"": "src"},
    entry_points={
        'console_scripts': [
            'basket-cli = basket.main:main'
        ]
    },
)
