# Bypass Django 6.x requirement for MySQL 8.4+ on MySQL 8.0
from django.db.backends.base.base import BaseDatabaseWrapper
BaseDatabaseWrapper.check_database_version_supported = lambda self: None
